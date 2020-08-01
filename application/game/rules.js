import Player from "./player.js";
import mafia from "./mafia.js";

function shuffle(a) { // спызжено отсюда https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	for (let i = a.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export default class Rules {
	constructor() {
		this.talkTime = 1000 * 60; // 1 минута
	}
	
	setRoles(players) {
		// иллюстрированный пример работы правила:
		// [P, P, P, P, P, P, P, P, P, P] => 10 шт, [10/4] = 3 мафии + 1 шериф
		//  => [M, M, M, S, C, C, C, C, C, C] =>
		//  => [M, C, C, M, M, C, C, S, C, C]
		players = Object.values(players);
		
		let S = players.length >= 5, // шериф входит в игру только если игроков как минимум 5 шт
			N = players.length, // всего игроков, они поделятся на мафию и мирных
			M = Math.round(N / 4); // общее число мафии
		
		shuffle(players); // игроки перемешиваются, чтобы раздать роли случайно
		
		for (let i = 0; i < N; i++) {
			let role = Player.CIVILIAN;
			if (i < M) role = Player.MAFIA;
			if (S && i === M) role = Player.SHERIFF;
			
			players[i].role = role;
		}
	}
	
	checkMafiaWins(players) {
		players = Object.values(players).filter(p => p.role !== Player.SPECTATOR); // живые
		let mafia = Object.values(players).filter(p => p.role === Player.MAFIA); // из них мафия
		let civilian = Object.values(players).filter(p => p.role !== Player.MAFIA); // из них мафия
		return mafia.length >= civilian.length; // побеждают когда мафии становится как минимум половина
	}
	
	checkCivilianWins(players) {
		let mafia = Object.values(players).filter(p => p.role === Player.MAFIA); // мафия
		return mafia.length === 0; // побеждают когда мафия искоренена полностью
	}
}
