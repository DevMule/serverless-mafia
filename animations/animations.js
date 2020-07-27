import {showChat, showLogs} from "./info.js";
import {changeView, choosePlayer} from "./player_view.js";

document.getElementById('chat-rules').onclick = showChat;
document.getElementById('log-rules').onclick = showLogs;

document.getElementById("change-game-view").onclick = () => changeView();

for (let player_div of document.getElementsByClassName('player'))
{
    player_div.onclick = () =>  choosePlayer(player_div);
}