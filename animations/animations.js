import View from './view.js'

let view = new View()

globalThis.view = view;

view.createPlayer('Player 1','',{dead: true, rule: 'mafia'});
view.createPlayer('Player 2','../img/day.png', {voiced: true, voted:2});
view.createPlayer('Player 3','',{rule: 'peaceful', muted: true});
view.createChatMessage('Player 1', 'Lorem ipsum dolor sit amet, con!')
view.createChatMessage('Player 2', '123 123 13 12312 12342121 312321!')
view.setRoomName('Test room');