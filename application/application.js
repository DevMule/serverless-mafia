import "./settings.js"; // global settings

class Application {
	constructor() {
		this.conference = null;
		
		VoxeetSDK.command.on("received", this.onMessage.bind(this));
		VoxeetSDK.conference.on("ended", this.onEndedConference.bind(this));
		VoxeetSDK.conference.on("joined", this.onJoinedConference.bind(this));
		VoxeetSDK.conference.on("left", this.onLeftConference.bind(this));
		VoxeetSDK.conference.on('participantAdded', this.onParticipantAdded.bind(this));
		VoxeetSDK.conference.on('participantUpdated', this.onParticipantUpdated.bind(this));
		VoxeetSDK.conference.on('streamAdded', this.onStreamAdded.bind(this));
		VoxeetSDK.conference.on('streamRemoved', this.onStreamRemoved.bind(this));
		VoxeetSDK.conference.on('streamUpdated', this.onStreamUpdated.bind(this));
		
		this.init();
	}
	
	async init() {
		await VoxeetSDK.initialize(document.settings.voxeet.key, document.settings.voxeet.secret);
		await this.sessionOpen();
	}
	
	// events
	onMessage(participant /*Participant*/, message /*Object*/) {
	}
	
	// conference
	onLeftConference() {
	}
	
	onEndedConference() {
	}
	
	onJoinedConference() {
	}
	
	async conferenceCreate() {
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
	
	async conferenceJoin(conferenceId) {
		await VoxeetSDK.conference
			.join(conferenceId, {constraints: {audio: true, video: true}})
			.then(conference => {
				this.conference = conference;
			}).catch(error => {
				console.error(error);
			});
	}
	
	// sessions
	async sessionOpen() {
		VoxeetSDK.session.open({name: "John Doe"})
			.then(() => {
				this.conferenceCreate();
			});
	}
	
	async sessionClose() {
		VoxeetSDK.session.close();
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

const App = new Application();
