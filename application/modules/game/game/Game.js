const Gamer = require('./entities/Gamer');

class Game {

    constructor({ mediator, events, db, name } = {}) {
        this.db = db;
        this.name = name;
        this.gamers = {};
        this.mediator = mediator;
        this.events = events;
        // запустить игру
        const mainInterval = setInterval(() => this.update(), 100 /* 40 */);
    }

    moveGamer(direction, token) {
        if(this.gamers[token]) {
            this.gamers[token].move(direction);
        }
    }

    changeRotationGamer( rotationParams, token) {
        if(this.gamers[token]) {
            this.gamers[token].changeRotation(rotationParams);
        }
    }

    getData() {
        let gamersCount = 0;
        for (let gamer in this.gamers) {
            gamersCount++;
        }
        return {
            name: this.name,
            gamersCount
        }
    }

    joinGame(token) {
        const x = 5 //Math.random();
        const y = 10 //Math.random();
        const z = 30 //Math.random();
        this.gamers[token] = new Gamer({ x, y, z });
        //...
        return this.getScene();
    }
    
    leaveGame(token) {
        if (token in this.gamers) {
            delete this.gamers[token];
            return true;
        }
        return false;
    }

    die(gamer) {}

    respawn(gamer) {}

    shot(user, alphaV) {}
    //jump(user) {}

    getScene() {
        return {
            gamers: this.gamers
        };
    }

    getGameData() {
        return {
            name: this.name,
            gamers: this.gamers
        };
    }

    update() {
        // обсчитать изменения, произошедшие на арене (движение игроков и полёт пуль)
        // выяснить, кто помер, кого ударили, в кого что попало и т.д.
        const data = this.getGameData();
        if(Object.keys(data.gamers).length > 0) {
            this.mediator.call(this.events.SEND_GAMERS_INFO, data);
        };
    }
}

module.exports = Game;