// import Mafia from '../application/game/mafia.js'

class View
{
    constructor()
    {
        this.body = document.getElementById('game-field')

        this.chat = document.getElementById('chat')
        this.chatBody = document.getElementById('chat-body')

        this.chatControls = document.getElementById('chat-controls');
        this.muteMicro = document.getElementById('microphone-mute');
        this.muteVideo = document.getElementById('video-mute')

		this.timeOfDay = document.getElementById('time-of-day')
        this.showChat = document.getElementById('chat-show');

        this.voteQuestion = document.getElementById('vote-question');
        this.voteYes = document.getElementById('vote-yes');
        this.onVoteFuncton = (username) => {console.log('vote on: ',username)};
        this.voteCancel = document.getElementById('vote-cancel');
       	this.voteQuestionShowed = false;
       	this.body.onclick = this.askQuestion.bind(this);
       	this.voteCancel.onclick = this.hideQuestion.bind(this);

        this.chatHidden = true;

        this.w = parseInt(this.body.clientWidth)
        this.h = parseInt(this.body.clientHeight)
        
        this._perRow = 2;
        this.perRowSetted = false;

        this._standartWidth = 480;
        this.standartMinWidht = 200;
        this._standartHeight = 270;
        this.playerMargin = 10;

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        this.bindControls();        
    }

    showQuestion(event, username)
    {
    	this.voteQuestionShowed = true;
    	this.voteQuestion.hidden = false;
    	this.voteQuestion.getElementsByClassName('username')[0].innerText = username;

    	this.voteQuestion.style.top = event.pageY + 'px';
    	this.voteQuestion.style.left = event.pageX + 'px';
    	this.voteYes.onclick = () => {
    		this.onVoteFuncton(username);
    		this.hideQuestion();
    	}
    }

    hideQuestion()
    {
    	this.voteQuestionShowed = false;
    	this.voteQuestion.hidden = true;
    }

    askQuestion(event)
    {
    	for (let player of this.players)
    	{
    		if (player.contains(event.target))
    		{
    			let username = player.getElementsByClassName('username')[0].innerText;
    			return this.showQuestion(event, username);
    		}
    	}
    	this.hideQuestion();
    }

    bindControls()
    {
    	this.showChat.onclick = this.hideChat.bind(this)
    	this.muteMicro.onclick = this.changeMuteMicro.bind(this)
    	this.muteVideo.onclick = this.changeMuteVideo.bind(this)
    }


    resize()
    {
    	this.w = parseInt(this.body.clientWidth);
        this.h = parseInt(this.body.clientHeight);
        this.resizePlayers();
    }

    resizePlayers()
    {
    	this._perRow = !this.perRowSetted ? Math.ceil(Math.sqrt(this.players.length)) : this._perRow;
    	this.standartWidth = this.w / this.perRow - 2 * this.playerMargin;
    	this.standartHeight = this.players ? this.h / Math.ceil(this.players.length / this.perRow) - 2*this.playerMargin : this.standartHeight; 
    	
    	for (let player of this.players)
    	{
    		player.style.flexBasis = this.standartWidth + 'px';
			player.style.height = this.standartHeight + 'px';
    	}
    }


    get perRow() {return this._perRow;}
    set perRow(value)
    {
    	this._perRow = value;
    	this.perRowSetted = true;
    	this.resizePlayers();
    }

    get standartWidth() {return this._standartWidth;}
    set standartWidth(value) {this._standartWidth = value > this.standartMinWidht ? value : this.standartMinWidht;}

    get standartHeight() {return this._standartHeight;}
    set standartHeight(value) {this._standartHeight = value < this.standartWidth ? value : this.standartWidth;}

    setRoomName(roomName)
    {
    	let roomLink = document.createElement('a');
    	
    	let roomElement = document.createElement('li');
    	roomLink.href = window.location.href;
    	roomElement.innerText = 'Комната: "' + roomName + '"';
    	roomLink.append(roomElement);

    	document.getElementById('menu').append(roomLink);
    }

    changeMuteMicro() {this.muteMicro.classList.toggle('muted');}
    changeMuteVideo() {this.muteVideo.classList.toggle('muted');}

    hideChat()
    {
    	this.chatHidden = !this.chatHidden;
    	this.chat.hidden = this.chatHidden;
    }

    createPlayer(username, src = '', options)
    {
    	if (!this.body) return;
        let player = document.createElement('div');
		player.classList.add('player');
		player.style.margin = this.playerMargin + 'px';
		player.style.flexBasis = this.standartWidth + 'px';
		player.style.height = this.standartWidth * 9 / 16 + 'px';

        if (options)
        {
        	if (options.voiced) player.classList.add('voiced');
        	if (options.muted) player.classList.add('muted');
        	if (options.dead) player.classList.add('dead')
        	if (options.rule) player.setAttribute('rule', options.rule)
        	if (options.voted) player.setAttribute('voted', options.voted)
        }

        let label = document.createElement('label');
        label.classList.add('username');
        label.innerText = username;
        player.append(label);

        let info = document.createElement('div');
        info.classList.add('player-info');
        player.append(info)

        let vote = document.createElement('div');
        vote.classList.add('player-vote')
        player.append(vote)

        let dead = document.createElement('div');
        dead.classList.add('player-dead');
        player.append(dead);

        this.body.append(player);
        this.resizePlayers();
        if (options && options.voted)	this.playersVote();
    }

    createChatMessage(username, message)
    {
    	if (!this.chatBody) return;
    	let p = document.createElement('p');
    	p.classList.add('message');

    	let label = document.createElement('label')
    	label.classList.add('username')
    	label.innerText = username;
    	p.append(label);

    	let colon = document.createElement('b');
    	colon.innerText = ': ';
    	p.append(colon);

    	let text = document.createTextNode(message);
    	p.append(text);
    	
    	this.chatBody.append(p);
    }

    get players() {return this.body.children;}
    get messages() {return this.chatBody.children;}

    removePlayer(id) {this.players[id].remove();}
    removeMessage(id) {this.messages[id].remove();}


    setPlayerMute(id) {this.players[id].classList.add('muted');}
    setTimeOfDay(timeState) {this.timeOfDay.setAttribute('part', timeState);}
    setPlayerRule(id, rule) {this.players[id].setAttribute('rule',rule);}
    setPlayerVote(id, voteCount)
    {
    	this.players[id].setAttribute('voted',voteCount);
    	this.playersVote();
    }

    playersVote()
    {
    	for (let player of document.querySelectorAll('.player[voted]'))
    	{
    		player.querySelector('.player-vote').innerText = player.getAttribute('voted');
    	}
    }
}

export default View;