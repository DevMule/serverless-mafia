import Player from "./player.js";

export default class Mafia {
	constructor(app) {
		this.app = app;
		
		this.players /*[Player]*/ = [];
		this.me /*Player*/ = null;
		this.screen = document.getElementById("game");
	}
}

Mafia.GAME_WAITING = "gameWaiting";
Mafia.GAME_PLAYING = "gamePlaying";

Mafia.TIME_DAY = "timeDay";
Mafia.TIME_NIGHT = "timeNight";
