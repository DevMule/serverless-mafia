class View
{
	/*
		Класс View предоставляет функционал для изменения интерфейса игры.
		
		Полезные атрибуты:
			players - массив всех элементов с игроками (<div class = "player">);
			messages - массив всех сообщений в чате (<div class = "message">).

		Полезные методы:
			createPlayer (username, src, options) - создаёт элемент с игроком (изображение с камеры, имя пользователя, статус и пр.);
			createChatMessage (username, message) - создаёт сообщение;
			setRoomName (roomName) - отображает название комнаты (параметр roomName) в меню (<ul id="menu">) с ссылкой на текущую страницу;
			playersVote() - отображение голосов против игроков;
			removePlayer(id) - удаление пользователя с данным номером (id);
			removeMessage(id) - удаление сообщения с данным номером (id);
	    	setPlayerMute(id) - установка статуса выключенного микрофона для пользователя с данным номером (id);
	    	setTimeOfDay(timeState) - установка игрового времени суток. Игровое время суток (параметр timeState) может быть: "timeDay", "timeMeeting", "timeNight";
	    	setPlayerRule(id, rule) - установка роли для пользователя с данным номером (id). Роль (параметр rule) может быть: "mafia"(мафиози), "peaceful"(мирный житель), "sheriff"(коп);
	    	setPlayerVote(id, voteCount) - установка количества голосов (параметр voteCount) против игрока с данным номером (id).
	*/
    constructor()
    {
    	// Игровое поле, контейнер для элементов с игроками (изображение с камеры, имя пользователя, статус и пр.);
        this.body = document.getElementById('game-field') 

        // Элемент с чатом (контейнером для сообщений и полем их ввода) и контейнер для сообщений;
        this.chat = document.getElementById('chat')
        this.chatBody = document.getElementById('chat-body')

        // Контроллеры: отображение чата, выключение микрофона, выключение вебкамеры
        this.showChat = document.getElementById('chat-show');
        this.muteMicro = document.getElementById('microphone-mute');
        this.muteVideo = document.getElementById('video-mute');

        // Элемет с игровым временем дня (Ночь или День)
		this.timeOfDay = document.getElementById('time-of-day')

		// Вопрос о голосовании против игрока, кнопка с голосованием против игрока, кнопка с скрытием вопроса;
        this.voteQuestion = document.getElementById('vote-question');
        this.voteYes = document.getElementById('vote-yes');
        this.voteCancel = document.getElementById('vote-cancel');
        
        // Функция, выполняющаяся при голосовании против игрока. Имеет параметр username - имя пользователя;
        this.onVoteFuncton = (username) => {console.log('vote on: ',username)};

        // Установка параметров для отображения элементов с игроками.
        this._perRow = 2;
        this.perRowSetted = false;
        this._standartWidth = 480;
        this.standartMinWidht = 200;
        this._standartHeight = 270;
        this.playerMargin = 10;

        // Установка размеров игрового поля, привязка события изменения окна к изменению размеров и положения элементов с игроками.
        this.w = parseInt(this.body.clientWidth)
        this.h = parseInt(this.body.clientHeight)
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        // Установка оброботчиков на нажатия на кнопки.
        this.bindControls();        
    }

    showQuestion(event, username)
    {
    	/*
			Отображает сообщение с вопросом о голосовании против игрока.
			Сообщение отображается в позоции {x: event.pageX, y: event.pageY}.
			При голосовании против игрока вызывается функция onVoteFunction с именем данного пользователя, после чего сообщение скрывается.
    	*/
    	this.voteQuestion.hidden = false;
    	this.voteQuestion.getElementsByClassName('username')[0].innerText = username;

    	this.voteQuestion.style.top = event.pageY + 'px';
    	this.voteQuestion.style.left = event.pageX + 'px';
    	this.voteYes.onclick = () => {
    		this.onVoteFuncton(username);
    		this.hideQuestion();
    	}
    }

    hideQuestion() {/*Скрывает сообщение с вопросом о голосовании против игрока*/ this.voteQuestion.hidden = true;}

    askQuestion(event)
    {
    	/*
			Определяет, над каким элементом с игроком требуется отобразить вопрос о голосовании,
				после чего отображает его для этого игрока при помощи метода showQuestion.
    	*/
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
    	/*
			Добавление обработчиков при нажатии на элементы.
    	*/
    	this.showChat.onclick = this.hideChat.bind(this)
    	this.muteMicro.onclick = this.changeMuteMicro.bind(this)
    	this.muteVideo.onclick = this.changeMuteVideo.bind(this)

    	this.body.onclick = this.askQuestion.bind(this);
       	this.voteCancel.onclick = this.hideQuestion.bind(this);
    }

    resize()
    {
    	/*
			Метод вызывается при изменении размеров окна, переоперделяет размеры игрового поля (контейнера для элементов с игроками), 
			изменяет размеры элементов с игроками при помощи метода resizePlayers.
    	*/
    	this.w = parseInt(this.body.clientWidth);
        this.h = parseInt(this.body.clientHeight);
        this.resizePlayers();
    }

    resizePlayers()
    {
    	/*
			Изменяет размеры всех элементов с игроками.
			Элементы стараются расположиться так, чтобы столбцов из элементов было столько же или на 1 больше, чем строк из элементов.
    	*/
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

    hideChat() {this.chat.hidden = !this.chat.hidden;}

    createPlayer(username, src = '', options)
    {
    	/*
			Создаёт элемент игрока (в котором изображение, статус и пр.) вида:
				<div class = "player">
					<label class = "username">{{USERNAME}}</label>
					<div class = "info"></div>
					<div class = "vote"></div>
					<div class = "dead"></div>
				</div>
			, где: 
				{{USERNAME}} - значение параметра username,
			и добавляет внутрь <div id = 'game-field'>.

			В зависимости от options, для <div class = "player"> устанавливаются:
				класс "voiced" - означает, что данный игрок говорит.;
				класс "muted" - означает, что данный игрок выключил микрофон;
				класс "dead" - означает, что персонаж данного игрока умер в игре;
				атрибут "rule" - содержит роль персонажа данного игрока в игре (может быть: "mafia"(мафиози), "peaceful"(мирный житель), "sheriff"(коп));
				атрибут "voted" - содержит количество голосов против данного игрока*.
					* Для изменения количества голосов против каждого игрока вызывается метод playersVote().

			div-ы c классами "info", "vote", "dead" изначально скрыты (display: none).
				info отображается, если у player есть атрибут rule;
				vote отображается, если у player есть атрибут voted;
				dead оторбажается, если у player есть класс dead.
				
			Размер элемента определяется автоматически в зависимости от размеров окна и количества уже имеющихся игроков.
	    */

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
    	/*
			Создаёт сообщение вида:
				<p class = "message"><label class = "username">{{USERNAME}}</label><b>: </b>{{MESSAGE}}</p>
			, где: 
				{{USERNAME}} - значение параметра username;
				{{MESSAGE}} - значение параметра message;
			и добавляет внутрь <div id = 'chat-body'>.
	    */

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