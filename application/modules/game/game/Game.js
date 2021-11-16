const Gamer = require('./entities/Gamer');

class Game {

    constructor({ callbacks, db, name } = {}) {
        this.db = db;
        this.name = name;
        this.gamers = {};
        const { updateCb } = callbacks;
        this.updateCb = updateCb;
        // запустить игру
        const mainInterval = setInterval(() => this.update(), 1000);
    }

    changePositionGamer(position, token) {
        this.gamers[token].changePosition(position);
    }

    moveGamer(direction, token) {
        this.gamers[token].move(direction);
    }

    changeRotationGamer( rotationParams, token) {
        this.gamers[token].changeRotation(rotationParams);
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
        // вернуть позиции игроков и выстрелов

        return {
            name: this.name,
            gamers: this.gamers
        };
    }

    update() {
        // обсчитать изменения, произошедшие на арене (движение игроков и полёт пуль)
        // выяснить, кто помер, кого ударили, в кого что попало и т.д.
        this.updateCb(this.getGameData());
    }
}

module.exports = Game;