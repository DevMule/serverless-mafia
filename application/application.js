import "./settings.js"; // global settings
import Mafia from "./game/mafia.js";

class Application {
	constructor() {
		this.conference = null;
		
		// voxeet events
		VoxeetSDK.command.on("received", this.onMessage.bind(this));
		VoxeetSDK.conference.on("ended", this.onEndedConference.bind(this));
		VoxeetSDK.conference.on("joined", this.onJoinedConference.bind(this));
		VoxeetSDK.conference.on("left", this.onLeftConference.bind(this));
		VoxeetSDK.conference.on('participantAdded', this.onParticipantAdded.bind(this));
		VoxeetSDK.conference.on('participantUpdated', this.onParticipantUpdated.bind(this));
		VoxeetSDK.conference.on('streamAdded', this.onStreamAdded.bind(this));
		VoxeetSDK.conference.on('streamRemoved', this.onStreamRemoved.bind(this));
		VoxeetSDK.conference.on('streamUpdated', this.onStreamUpdated.bind(this));
		
		// set nickname events
		document.getElementById("nicknameEnter").children[0].children[1].onclick = () => {
			let nick = document.getElementById("nicknameEnter").children[0].children[0].value.trim();
			document.getElementById("nicknameEnter").children[0].children[2].style.display = (nick.length < 3) ? "" : "none";
			if (!(nick.length < 3)) this.sessionOpen(nick);
		};
		
		// connect to room or create room
		document.getElementById("connectToRoom").onclick = () => {
			let roomName = document.getElementById("chooseRoom").children[0].children[0].value;
			this.conferenceEnter(roomName);
		};
		
		this.init().then(r => {
			this.setInterface(Application.AUTH)
		});
	}
	
	async init() {
		try {
			await VoxeetSDK.initialize(document.settings.voxeet.key, document.settings.voxeet.secret);
		} catch (e) {
			alert(e);
		}
	}
	
	setInterface(state) {
		document.getElementById("offlineMessage").style.display = state === Application.OFFLINE ? "" : "none";
		document.getElementById("nicknameEnter").style.display = state === Application.AUTH ? "" : "none";
		document.getElementById("chooseRoom").style.display = state === Application.MENU ? "" : "none";
		document.getElementById("game").style.display = state === Application.GAME ? "" : "none";
	}
	
	// events
	onMessage(participant /*Participant*/, message /*Object*/) {
	}
	
	onJoinedConference() {
		this.setInterface(Application.GAME);
	}
	
	// conference
	onLeftConference() {
		this.setInterface(Application.MENU);
		this.conference = null;
	}
	
	onEndedConference() {
		this.setInterface(Application.MENU);
		this.conference = null;
	}
	
	// create new or enter existed conference
	conferenceEnter(name, pin) {
		let conf = null;
		VoxeetSDK.conference.create({
			alias: name,
			pinCode: pin,
		}).then((conference) => {
			VoxeetSDK.conference.join(conference, {});
			conf = conference;
		}).then(() => {
			this.conference = conf;
		}).catch(error => {
			console.error(error);
		});
	}
	
	// sessions
	sessionOpen(nick) {
		VoxeetSDK.session.open({name: nick})
			.then(() => {
				this.setInterface(Application.MENU);
			});
	}
	
	// participants
	onParticipantAdded(participant) {
	}
	
	onParticipantUpdated(participant) {
		// someone updated, maybe its better to look his status
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
}

Application.OFFLINE = 0;
Application.AUTH = 1;
Application.MENU = 2;
Application.GAME = 3;

const App = new Application();
