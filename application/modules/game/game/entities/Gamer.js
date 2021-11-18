const Direction = Object.freeze({
    Forward: 0,
    Back: 1,
    Right: 2,
    Left: 3
})

class Gamer {
    constructor({ x, y, z }, hp = 100, rotation = {x:0, y:0}) {
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotation = rotation;
        //Ходьба
        this.constMove = 0.4;
        //Повороты
        this.scale = 0.3;
        this.mousex = 0;
        this.mousey = 0;
    }

    move(direction) {
        switch (direction) {
          case Direction.Forward: {
            this.x -= this.constMove * Math.sin(Math.PI * this.mousex);
            this.z -= this.constMove * Math.cos(Math.PI * this.mousex);
            break;
          }
          case Direction.Back: {
            this.x += this.constMove * Math.sin(Math.PI * this.mousex);
            this.z += this.constMove * Math.cos(Math.PI * this.mousex);
            break;
          }
          case Direction.Right: {
            this.x += this.constMove * Math.sin(Math.PI * this.mousex + Math.PI / 2);
            this.z += this.constMove * Math.cos(Math.PI * this.mousex + Math.PI / 2);
            break;
          }
          case Direction.Left: {
            this.x += this.constMove * Math.sin(Math.PI * this.mousex - Math.PI / 2);
            this.z += this.constMove * Math.cos(Math.PI * this.mousex - Math.PI / 2);
            break;
          }
        }
    }

    changeRotation({ clientX, clientY, clientWidth, clientHeight }) {
        this.mousex = - (clientX / clientWidth) * 2 + 1;
        this.mousey = - (clientY / clientHeight) * 2 + 1;
        this.rotation.x = this.mousey / this.scale;
        this.rotation.y = this.mousex / this.scale;
    }

}

module.exports = Gamer;