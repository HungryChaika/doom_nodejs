const { prototype } = require('jasmine');
const Module = require('../Module');
const Game = require('./game/Game'); // конструктор арены

class GameManager extends Module {
    constructor(options) {
        super(options);

        this.games = [
            new Game({ 
                mediator: this.mediator,
                events: this.EVENTS,
                db: this.db,
                name: 'firstGame'
            }),
            new Game({ 
                mediator: this.mediator,
                events: this.EVENTS,
                db: this.db,
                name: 'secondGame'
            }),
            new Game({ 
                mediator: this.mediator,
                events: this.EVENTS,
                db: this.db,
                name: 'thirdGame'
            }),
            //new Game({ callbacks: { updateCb: (gameData) => {}} })
        ];

        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.MOVE, (data) => this.moveGamer(data));
            socket.on(this.MESSAGES.STOP_MOVE, () => this.stopMove(socket));
            socket.on(this.MESSAGES.GET_GAMES, () => this.getGames(socket));
            socket.on(this.MESSAGES.JOIN_GAME, (data) => this.joinGame(data, socket));
            socket.on(this.MESSAGES.LEAVE_GAME, (data) => this.leaveGame(data, socket));
            socket.on(this.MESSAGES.SPEED_UP, () => this.speedUp(socket));
            socket.on(this.MESSAGES.SPEED_DOWN, () => this.speedDown(socket));
            socket.on(this.MESSAGES.CHANGE_CAMERA_ROTATION, (data) => this.changeRotationGamer(data));

            socket.on('disconnect', () => {
               
            });
        });

        this.mediator.subscribe(this.EVENTS.SEND_GAMERS_INFO, data => this.updateCb(data));
    }

    updateCb( { name, gamers } ) {
        this.io.to(name).emit(this.MESSAGES.INFO_ABOUT_THE_GAMERS, gamers );
    }
 
    speedUp(socket) {
        socket.emit(this.MESSAGES.SPEED_CHANGE, {result: 'up'});
    }

    speedDown(socket) {
        socket.emit(this.MESSAGES.SPEED_CHANGE, {result: 'down'});
    }


    getGames(socket) {
        const games = this.games.map((elem) => elem.getData());
        socket.emit(this.MESSAGES.GET_GAMES, games);
    }

    joinGame(data, socket) {
        const { gameName, token } = data;
        const scene = this.games.find((game) => game.name === gameName).joinGame(token);
        if (scene) {
            
            socket.join(gameName);

            const games = this.games.map((elem) => elem.getData());
            this.io.emit(this.MESSAGES.GET_GAMES, games);
            return socket.emit(this.MESSAGES.JOIN_GAME, { result: true, gameName });
        }
        return socket.emit(this.MESSAGES.JOIN_GAME, { result: false });
    }

    leaveGame({ gameName, token }, socket) {
        const game = this.games.find((game) => game.name === gameName);
        if (game) {
            const result = game.leaveGame(token);
            if (result) {

                socket.leave(gameName);

                const games = this.games.map((elem) => elem.getData());
                this.io.emit(this.MESSAGES.GET_GAMES, games);
                return socket.emit(this.MESSAGES.LEAVE_GAME, { result });
            }
        }
        return socket.emit(this.MESSAGES.LEAVE_GAME, { result: false });
    }

    moveGamer({ gameName, direction, token }) {
        const game = this.games.find((game) => game.name === gameName);
        if (game) {
            game.moveGamer(direction, token);
        }
    }

    changeRotationGamer({ rotationParams, gameName, token }) {
        const game = this.games.find((game) => game.name === gameName);
        if(game) {
            game.changeRotationGamer(rotationParams, token);
        }
    }

    stopMove(socketId) {

    }

    getScene() {

    }
}

module.exports = GameManager;