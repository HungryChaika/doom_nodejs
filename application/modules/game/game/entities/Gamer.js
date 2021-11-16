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

    changeRotation(rotationParams) {
        // rotationParams { x, y }
        this.rotation = rotationParams;
    }

    /*
    changePosition(position) {
        // position { x, z }
        this.x = position.x;
        this.z = position.z;
    } */







    calcCos(vect1, vect2) {
        return this.scalMultForCos(vect1, vect2) / (this.vectModuleForCos(vect1) * this.vectModuleForCos(vect2));
      }
    
      scalMultForCos(vect1, vect2) {
        return vect1.x * vect2.x + vect1.z * vect2.z;
      }
    
      scalMult(vect1, vect2) {
        return vect1.x * vect2.x + vect1.y * vect2.y + vect1.z * vect2.z;
      }
    
      vectMult(vect1, vect2) {
        let x = vect1.y * vect2.z - vect1.z * vect2.y;
        let y = vect1.z * vect2.x - vect1.x * vect2.z;
        let z = vect1.x * vect2.y - vect1.y * vect2.x;
        return { x, y, z };
      }
    
      multVectNum(vect, num) {
        return { x: vect.x * num, y: vect.y * num, z: vect.z * num };
      }
    
      divVectNum(vect, num) {
        return { x: vect.x / num, y: vect.y / num, z: vect.z / num };
      }
    
      sumVect(vect1, vect2) {
        return { x: vect1.x + vect2.x, y: vect1.y + vect2.y, z: vect1.z + vect2.z };
      }
    
      subVect(vect1, vect2) {
        return { x: vect1.x - vect2.x, y: vect1.y - vect2.y, z: vect1.z - vect2.z };
      }
    
      vectModuleForCos(vect) {
        return Math.sqrt(vect.x ** 2 + vect.z ** 2);
      }
    
      vectModule(vect) {
        return Math.sqrt(vect.x ** 2 + vect.y ** 2 + vect.z ** 2);
      }

}

module.exports = Gamer;