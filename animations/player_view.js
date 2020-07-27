export function changeView(choose_player_id = "player-1")
{
    if (document.getElementById("game-view").className === "game-view-grid")
    {
        console.log(document.getElementById(choose_player_id));
        document.getElementById("index-view").appendChild(document.getElementById(choose_player_id));
        document.getElementById("game-view").className = "game-view-choose";
        document.getElementById("change-game-view-img").src = "img/view-grid.svg";
    }
    else
    {
        document.getElementById("grid-view").appendChild(document.querySelector("#index-view>.player"));
        document.getElementById("game-view").className = "game-view-grid";
        document.getElementById("change-game-view-img").src = "img/view-choose.svg";
    }
}

export function choosePlayer(player_div)
{
    if (document.getElementById("game-view").className === "game-view-grid")
    {
        changeView(player_div.id);
    }
    else
    {
        document.getElementById("grid-view").appendChild(document.querySelector("#index-view>.player"));
        document.getElementById("index-view").appendChild(player_div);
    }
}
