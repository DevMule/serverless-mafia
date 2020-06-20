import Player from "./player.js";

export default class Mafia {
	constructor() {
		VoxeetSDK.command.on("received", this.onMessage.bind(this));
		VoxeetSDK.conference.on('participantAdded', this.onUpdateParticipants.bind(this));
		VoxeetSDK.conference.on('participantUpdated', this.onUpdateParticipants.bind(this));
		
		this.screen = document.getElementById("game");
		
		this.players /*[Player]*/ = {};
		this.gameStatus = Mafia.GAME_WAITING;
		this.time = Mafia.TIME_DAY;
	}
	
	get raw() {
		let data = {
			gameStatus: this.gameStatus,
			time: this.time,
			players: {},
		};
		for (let [key, player] of Object.entries(this.players)) data.players[key] = player.raw;
		return data;
	}
	
	set raw(data) {
		this.time = data.time;
		this.gameStatus = data.gameStatus;
		
		let players = this.players;
		this.players = {};
		for (let [key, player] of Object.entries(data.players)) {
			if (!players[key]) players[key] = new player[key];
			players[key].raw = player;
			this.players[key] = players[key];
		}
	}
	
	get me() {
		return VoxeetSDK.session.participant;
	}
	
	get master() {
		let master = null;
		let keys = [...VoxeetSDK.conference.participants.keys()].sort(); // get all keys sorted
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (VoxeetSDK.conference.participants.get(key).status === "Connected") { // get first online user by key
				master = VoxeetSDK.conference.participants.get(key);
				break;
			}
		}
		return master;
	}
	
	set video(val) {
		if (val) VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant);
		else VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant);
	}
	
	set audio(val) {
		if (val) VoxeetSDK.conference.startAudio(VoxeetSDK.session.participant);
		else VoxeetSDK.conference.stopAudio(VoxeetSDK.session.participant);
	}
	
	// events
	onMessage(participant, message) {
		message = JSON.parse(message);
		switch (message.type) {
			case Mafia.UPDATE_GAME:
				this.raw = message.game;
				break;
			
			case Mafia.UPDATE_PLAYER:
				if (this.players[participant.id])
					this.players[participant.id].raw = message.player;
				break;
		}
	}
	
	onUpdateParticipants(participant) {
		if (participant.status === "Connected") {
			if (!this.players[participant.id]) {
				this.players[participant.id] = new Player(participant.id);
				this.syncGameData();
			}
		} else {
			if (this.players[participant.id]) {
				delete this.players[participant.id];
				this.syncGameData();
			}
		}
	}
	
	syncGameData() {
		if (this.master === this.me) {
			let message = {
				type: Mafia.UPDATE_GAME,
				game: this.raw,
			};
			VoxeetSDK.command.send(JSON.stringify(message));
		}
	}
	
	syncPlayer() {
		let message = {
			type: Mafia.UPDATE_PLAYER,
			player: this.players[this.me.id].raw,
		};
		VoxeetSDK.command.send(JSON.stringify(message));
	}
}

Mafia.UPDATE_GAME = "updateGame";
Mafia.UPDATE_PLAYER = "updatePlayer";

Mafia.GAME_WAITING = "gameWaiting";
Mafia.GAME_PLAYING = "gamePlaying";

Mafia.TIME_DAY = "timeDay";
Mafia.TIME_NIGHT = "timeNight";
