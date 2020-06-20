export default class Player {
	constructor(id) {
		this.role = Player.SPECTATOR;
		this.participantID = id;
	}
	
	get raw() {
		let data = {};
		for (let [key, value] of Object.entries(this))
			data[key] = value;
		return data;
	}
	
	set raw(data) {
		for (let [key, value] of Object.entries(data))
			this[key] = value;
	}
}

Player.SPECTATOR = 0;
Player.CIVILIAN = 1;
Player.MAFIA = 2;
Player.SHERIFF = 3;
