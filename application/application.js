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
	
	// conference
	onLeftConference() {
	}
	
	onEndedConference() {
		this.setInterface(Application.MENU);
	}
	
	onJoinedConference() {
	}
	
	conferenceCreate() {
		VoxeetSDK.conference.create({
			/*options*/
			alias: "name",
			params: {},
			pinCode: "code",
		}).then((conference) => {
			this.conferenceJoin(conference.id);
		}).catch(error => {
			console.error(error);
		});
	}
	
	conferenceLeave() {
	}
	
	conferenceJoin(conferenceId) {
		VoxeetSDK.conference
			.join(conferenceId, {constraints: {audio: true, video: true}})
			.then(conference => {
				this.conference = conference;
			}).catch(error => console.error(error));
	}
	
	// sessions
	sessionOpen(nick) {
		VoxeetSDK.session.open({name: nick})
			.then(() => {
				this.conferenceCreate();
				this.setInterface(Application.MENU);
			});
	}
	
	sessionClose() {
		VoxeetSDK.session.close().then(() => {
			this.conference = null;
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
