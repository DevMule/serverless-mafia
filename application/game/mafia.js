import Player from "./player.js";
import Rules from "./rules.js";

export default class Mafia {
	constructor() {
		VoxeetSDK.command.on("received", this.onMessage.bind(this));
		VoxeetSDK.conference.on('participantAdded', this.onUpdateParticipants.bind(this));
		VoxeetSDK.conference.on('participantUpdated', this.onUpdateParticipants.bind(this));
		
		this.screen = document.getElementById("game");
		this.rules = new Rules();
		
		this.players /*[Player]*/ = {};
		
		// game cycle
		this.gameStatus = Mafia.GAME_WAITING;
		this.partOfDay = Mafia.TIME_DAY;
		
		this.time = 0;
	}
	
	// data в пересылаемом виде :з
	get raw() {
		let data = {
			gameStatus: this.gameStatus,
			partOfDay: this.partOfDay,
			
			time: this.time,
			
			players: {},
		};
		for (let [key, player] of Object.entries(this.players)) data.players[key] = player.raw;
		return data;
	}
	
	set raw(data) {
		this.gameStatus = data.gameStatus;
		this.partOfDay = data.partOfDay;
		
		this.time = data.time;
		
		let players = this.players;
		this.players = {};
		for (let [key, player] of Object.entries(data.players)) {
			if (!players[key]) players[key] = new player[key];
			players[key].raw = player;
			this.players[key] = players[key];
		}
	}
	
	// Voxeet interface
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
	
	// синхронизация
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
	
	// game loop
	startGame() {
		if (this.master === this.me && this.gameStatus === Mafia.GAME_WAITING) {
			this.rules.setRoles(this.players);
			this.gameStatus = Mafia.GAME_PLAYING;
			this.partOfDay = Mafia.TIME_MEETING;
			this.time = 0;
			this.syncGameData();
		}
	}
	
	tick(dt) {
		if (this.gameStatus === Mafia.GAME_PLAYING) {
			this.time += dt; // время течёт, время бежит
			if (this.master === this.me) {
				
				let players = Object.values(this.players).sort((a, b) => b.participantID > a.participantID ? 1 : -1);
				
				if (this.partOfDay === Mafia.TIME_MEETING) {
					// пройтись по всем игрокам, дать им время на поболтать
					
				} else if (this.partOfDay === Mafia.TIME_DAY) {
				
				} else if (this.partOfDay === Mafia.TIME_NIGHT) {
				
				}
			}
		}
	}
}

Mafia.UPDATE_GAME = "updateGame";
Mafia.UPDATE_PLAYER = "updatePlayer";

Mafia.GAME_WAITING = "gameWaiting";
Mafia.GAME_PLAYING = "gamePlaying";

Mafia.TIME_MEETING = "timeMeeting";
Mafia.TIME_DAY = "timeDay";
Mafia.TIME_NIGHT = "timeNight";
