const Module = require('../Module');
const Game = require('./game/Game'); // конструктор арены

class GameManager extends Module {
    constructor(options) {
        super(options);

        this.games = [
            new Game({ 
                callbacks: { updateCb: this.updateCb/* : (gameData) => {} */ },
                db: this.db,
                name: 'firstGame'
            }),
            new Game({ 
                callbacks: { updateCb: this.updateCb/* : (gameData) => {} */ },
                db: this.db,
                name: 'secondGame'
            }),
            new Game({ 
                callbacks: { updateCb: this.updateCb/* : (gameData) => {} */ },
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
            //socket.on(this.MESSAGES.CHANGE_CAMERA_ROTATION, (data) => this.changeRotation(data));
            //socket.on(this.MESSAGES.CHANGE_POSITION, (data) => this.changePosition(data));

            socket.on('disconnect', () => {
               
            });
        });
    }
// Не работает из-за колбеков, т.к. запускается в Game.js
    updateCb({ name, gamers}) {
        console.log(typeof(this.games));
        const game = this.games.find((game) => game.name === name);
        if(game) {
            this.io.to(name).emit(this.MESSAGES.INFO_ABOUT_THE_GAMERS, gamers );
        }
    }

// Потом удалить
    /* changeCameraRotation(data) {
        const { rotationParams, gameName, token } = data;
        const game = this.games.find((game) => game.name === gameName);
        if(game) {
            game.changeCameraRotationGamer(rotationParams, token);
            for(let gamer in game) {
                if(gamer) {
                    
                };
            };
        };
        
    }
// Потом удалить
    changePosition(data) {
        const { position, gameName, token } = data;
        const game = this.games.find((game) => game.name === gameName);
        if(game) {
            game.changePositionGamer(position, token);
            for(let gamer in game) {
                if(gamer) {
                    
                };
            };
        };
        
    } */
 
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
            /*
            const info = {
                x: scene.gamers[token].x ,
                y: scene.gamers[token].y ,
                z: scene.gamers[token].x ,
                rotation: scene.gamers[token].rotation
            };
            socket.to(gameName).emit(this.MESSAGES.INFO_ABOUT_THE_GAMERS, info );
            */

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
                const games = this.games.map((elem) => elem.getData());
                this.io.emit(this.MESSAGES.GET_GAMES, games);
                return socket.emit(this.MESSAGES.LEAVE_GAME, { result });
            }
        }
        return socket.emit(this.MESSAGES.LEAVE_GAME, { result: false });
    }

    moveGamer({ gameName, direction, token }) {
        if (gameName && direction && token) {
            const game = this.games.find((game) => game.name === gameName);
            if (game) {
                game.moveGamer(direction, token);
            }
        }
    }

    changeRotationGamer({ rotationParams, gameName, token }) {
        if(gameName && rotationParams && token) {
            const game = this.games.find((game) => game.name === gameName);
            if(game) {
                game.changeRotationGamer(rotationParams, token);
        }
        }
    }

    stopMove(socketId) {

    }

    getScene() {

    }
}

module.exports = GameManager;