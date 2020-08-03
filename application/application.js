import "./settings.js"; // global settings
import Game from "./game/mafia.js";

class Application {
	constructor() {
		this.game /*Mafia*/ = new Game();
		this.state = Application.OFFLINE;
		
		// voxeet events
		VoxeetSDK.conference.on("ended", this.onEndedConference.bind(this));
		VoxeetSDK.conference.on("joined", this.onJoinedConference.bind(this));
		VoxeetSDK.conference.on("left", this.onLeftConference.bind(this));
		VoxeetSDK.conference.on('streamAdded', this.onStreamAdded.bind(this));
		VoxeetSDK.conference.on('streamRemoved', this.onStreamRemoved.bind(this));
		VoxeetSDK.conference.on('streamUpdated', this.onStreamUpdated.bind(this));
		
		this.nicknameInput = document.getElementById("nicknameEnter").children[0].children[0];
		this.nicknameLoginBtn = document.getElementById("nicknameEnter").children[0].children[1];
		this.nicknameError = document.getElementById("nicknameEnter").children[0].children[2];
		this.roomNameInput = document.getElementById("chooseRoom").children[0].children[0];
		this.roomConnectBtn = document.getElementById("connectToRoom");
		this.goToMenuBtn = document.getElementById("menu").children[0];
		
		// set nickname events
		this.nicknameLoginBtn.onclick = () => {
			let nick = this.nicknameInput.value.trim();
			this.nicknameError.style.display = (nick.length < 3) ? "" : "none";
			if (!(nick.length < 3)) this.sessionOpen(nick);
			this.nicknameLoginBtn.disabled = true;
		};
		
		// connect to room or create room
		this.roomConnectBtn.onclick = () => {
			this.conferenceEnter(this.roomNameInput.value);
			this.roomConnectBtn.disabled = true;
		};
		
		this.goToMenuBtn.onclick = () => {
			if (this.state === Application.GAME) VoxeetSDK.conference.leave();
		};
		
		this.init();
	}
	
	async init() {
		try {
			await VoxeetSDK.initialize(globalThis.settings.voxeet.key, globalThis.settings.voxeet.secret);
			this.setInterface(Application.AUTH)
		} catch (e) {
			alert(e);
		}
	}
	
	setInterface(state) {
		this.state = state;
		
		document.getElementById("offlineMessage").style.display = state === Application.OFFLINE ? "" : "none";
		document.getElementById("nicknameEnter").style.display = state === Application.AUTH ? "" : "none";
		document.getElementById("chooseRoom").style.display = state === Application.MENU ? "" : "none";
		document.getElementById("game").style.display = state === Application.GAME ? "" : "none";
		
		if (state === Application.MENU) this.roomConnectBtn.disabled = false;
		if (state === Application.AUTH) this.nicknameLoginBtn.disabled = false;
		
	}
	
	// me joined
	onJoinedConference() {
		this.setInterface(Application.GAME);
		this.game.video = false;
		this.game.audio = true;
	}
	
	// conference
	onLeftConference() {
		this.setInterface(Application.MENU);
	}
	
	onEndedConference() {
		this.setInterface(Application.MENU);
	}
	
	// create new or enter existed conference
	async conferenceEnter(name) {
		let constraints = {
			audio: true,
			video: {
				width: {
					min: "320",
					max: "960",
				},
				height: {
					min: "240",
					max: "720",
				},
			},
		};
		let conference = await VoxeetSDK.conference.create({alias: name});
		await VoxeetSDK.conference.join(conference, {constraints});
	}
	
	// sessions
	async sessionOpen(nick) {
		await VoxeetSDK.session.open({name: nick});
		this.setInterface(Application.MENU);
	}
	
	// streams
	onStreamAdded(participant, stream) {
		// let node = document.getElementById("received_video");
		// navigator.attachMediaStream(node, stream);
		// set new node
	}
	
	onStreamUpdated(participant, stream) {
	}
	
	onStreamRemoved(participant, stream) {
	}
	
	tick(dt) {
		this.game.tick(dt);
	}
}

Application.OFFLINE = 0;
Application.AUTH = 1;
Application.MENU = 2;
Application.GAME = 3;

const App = new Application();
let timestamp = Date.now();
setInterval(() => {
	let now = Date.now();
	let dt = now - timestamp;
	timestamp = now;
	App.tick(dt);
}, 100);

if (globalThis.settings.debug) globalThis.App = App;
