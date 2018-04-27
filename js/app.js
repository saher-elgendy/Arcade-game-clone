
class Entities{
    constructor(x,y,speed,sprite){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = sprite;
    
    }
// a static function to change the speed of enemies when need this
    static changeSpeed(){
      return Math.floor(Math.random() * 200) + 100  ;
    }
  
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}
// Enemies our player must avoid
class Enemy extends Entities {
    constructor(x,y,speed,sprite) {
        super(x,y,speed);
        this.sprite = "images/enemy-bug.png";
    }

    render() {
        super.render();
    }
// updating enemies positions and speed
    update(dt) {
        this.x += this.speed * dt;

    // this will reset the position of the enemies again when be off-canvas
        if (this.x > ctx.canvas.width) {
            this.x = 0;
            this.speed = Entities.changeSpeed();
        }
    }
 // checking collisions of enemies with the player and resetting the position of the player after collision
    checkCollisions(){
      //creating  a range in which both player and enemies should not exist together
       if(player.x - this.x >= -40 && player.x - this.x <= 70 && 
                    player.y - this.y >= -40 && player.y - this.y <= 30 ) {
        // initial positions
         player.x = 200;
         player.y = 400;
       }
    }
}

// the player which we control
class Player extends Entities {
    constructor(x,y,sprite) {
        super(x,y,sprite);
        this.sprite = 'images/char-boy.png';
    }

    render() {
        super.render();
      
    }

// updating the player positions in response to crossing boundaries
    update() {   
        this.x = this.x < 0 ? 0 : this.x > 400 ? 400 : this.x;
        this.y = this.y < 50 ? 50 : this.y > 380 ? 380 : this.y;  
   } 
// updating positions of the player in response to pressing control keys
    handleInput(pressedKey) {
        switch (pressedKey) {
          case 'left':
             this.x = this.x - 100;
             break;

          case 'right':
             this.x = this.x + 100;
             break;

          case 'up':
             this.y = this.y - 80;
             break;
       
          case 'down':
              this.y = this.y + 80;
             break;
      }
    }  
    choosePlayer(){
       this.classList.add('chosen');

       const chosen = document.querySelector('.chosen');

        playerCharacters.forEach(character => {
          if(!character.classList.contains('chosen')) character.style.display = 'none';  
        });

         player.sprite = chosen.firstElementChild.src;
      
    } 
    
   
}

const player = new Player(200,380);

const playerCharacters = [...document.querySelectorAll('.player')];

playerCharacters.forEach(character => character.addEventListener('click', player.choosePlayer));

// Position "y" where the enemies will are created
const enemiesY = [50, 140, 220];
// creating an array of enemies 
const allEnemies = enemiesY.map(y => new Enemy(0, y, Entities.changeSpeed()));

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// when click start game button 
function startGame() {
  const starter = document.querySelector('.starter');
  starter.style.display = 'none';
  ctx.canvas.style.display = 'block';
}

document.querySelector('.start-button').addEventListener('click',startGame);

