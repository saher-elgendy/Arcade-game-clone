

// the music is from https://the-arcadium.net/

class Entities{
    constructor(x,y,sprite){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
// a static function to change the speed of enemies when need this
  
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}
// Enemies our player must avoid
class Enemy extends Entities {
    constructor(x,y,sprite,speed) {
        super(x,y,sprite);
        this.speed = speed;
    }

    render() {
        super.render();
    }

    static changeSpeed(){
      return Math.floor(Math.random() * 200) + 100  ;
    }
  
// updating enemies positions and speed
    update(dt) {
        this.x += this.speed * dt;

    // this will reset the position of the enemies again when be off-canvas
        if (this.x > ctx.canvas.width) {
            this.x = 0;
            this.speed = Enemy.changeSpeed();
        }
    }
 // checking collisions of enemies with the player and resetting the position of the player after collision
    checkCollisions(){
      //creating  a range in which both player and enemies should not exist together
        const livesCont = document.querySelector('.lives');
       
        
        
        if(player.x - this.x >= -40 && player.x - this.x <= 70 && 
                    player.y - this.y >= -40 && player.y - this.y <= 30 ) {
           // initial positions
           player.x = 200;
           player.y = 400;          
           // sound of collision
           const collisionSound = new Audio('sounds/collision.mp3');
           collisionSound.volume = 0.6;
           collisionSound.play()
           // player lives decrease by one
           player.lives -= 1;
           // show the updated lives number 
           livesCont.innerHTML = player.lives;
           // check if the player still have lives
           player.die();

       }
       // check if the player completed all tasks successfully
      // player.win();
    }
}

// the player which we control
class Player extends Entities {
    constructor(x,y, sprite) {
        super(x,y);
        this.sprite = sprite || 'images/char-boy.png';
        this.lives = 5;
        this.score = 0;
    }

    render() {
        super.render();  
    }

// updating the player positions in response to crossing boundaries
    update() {  
        //the player can not cross the boundaries
        this.x = this.x < 0 ? 0 : this.x > 400 ? 400 : this.x;
        this.y = this.y < 50 ? 50 : this.y > 380 ? 380 : this.y;
        // get the sprite of the character chosen to start the game
        this.getSprite();
       // if the player got the key pposition it temporarily in x 200 and y 200
        if(this.score >= 100000 && this.score <= 150000){ // 
          setTimeout(() =>{
            this.score += 50000;
            document.querySelector('.points').innerHTML = this.score;
          }, 1000);

          this.x = 200;
          this.y = 400;
          // the princess scream 
          const screamSound = new Audio('sounds/scream.mp3');
          setTimeout(() => screamSound.play(), 2000);
        }

        if(this.score > 100000 && player.y == 50){
          this.win();
        }
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
    // this function will get the character chosen to start the game
    getSprite() {
         const chosen = document.querySelector('.chosen');
         // if we choosed a different player instead of the default one the player changed to the chosen
         if(chosen) {
             this.sprite = chosen.firstElementChild.getAttribute('src');   
         }  
    }

   win() {
           // hide the canvas
           ctx.canvas.style.display = 'none'
           // show the modal
           document.querySelector('.modal').style.display = 'block';
           // hide the statics panel 
           document.querySelector('.statics').style.display = 'none';
           //show the final message
           document.querySelector('.final-msg').innerHTML = 'You Win';
           //show the final score
           document.querySelector('.final-score').innerHTML = document.querySelector('.points').innerHTML; 
           // the princess laugh
           const laughSound = new Audio('sounds/laugh.mp3');
           setTimeout(() => laughSound.play(), 1500);
           //go to the start page
           setTimeout(() => location.reload(), 7000);
       
    }

    die(){
       if (this.lives == 0 && this.score < 50000) {
           // stop the main music
           mainMusic.pause();
           // hide the canvas
           ctx.canvas.style.display = 'none';
           // show the modal
           document.querySelector('.modal').style.display = 'block';
           // hide the statics panel
           document.querySelector('.statics').style.display = 'none';
           // showing the final score
           document.querySelector('.final-score').innerHTML = `Score: ${player.score}`;
           // sound of game over and delay it two seconds
           const gameOverSound = new Audio('sounds/game over.wav');
           gameOverSound.volume = 0.4;
           setTimeout(() => gameOverSound.play(), 2000);
           // go to the start page
           setTimeout(() => location.reload(), 7000);
       }

     }

    static choosePlayer(){
       this.classList.add('chosen');
    
       const chosen = document.querySelector('.chosen');
       // chhoose the player and remove the others
        playerCharacters.forEach(character => {
          if(!character.classList.contains('chosen')) character.style.display = 'none';  
        });      
    }
}

class Prize extends Entities {
    constructor(x, y, sprite) {
         super();
         this.x = x || Math.floor(Math.random() * 400);
         this.y = y || Math.floor(Math.random() * 250) ;
         this.sprite = sprite;
     }

    render(){
         super.render();
    }
    
   reset(){
       this.x = Math.floor(Math.random() * 350);
       this.y = Math.floor(Math.random() * 250);

       const resetSound = new Audio('sounds/reset.wav');
       resetSound.volume = 0.2;
       resetSound.play();

       //if(player.score >= 100000)  resetSound.pause()
  }

  update() {
       if(this.sprite === 'images/Heart.png'){
            player.lives += 1;
            document.querySelector('.lives').innerHTML =  player.lives;
            const newSoulSound = new Audio('sounds/new-life.mp3');
            newSoulSound.play();
       }

       if(this.sprite === 'images/Key.png') {
            allEnemies.forEach(enemy => {
                enemy.x = -400;
                enemy.y = -400;
            });
           
          
            const explosionSound = new Audio('sounds/explosion.mp3')
            explosionSound.volume = 0.4;
            explosionSound.play();
                    
      }
  }

  collected(){
            const points = document.querySelector('.points')
           
            if(player.x - this.x >= -60 && player.x - this.x <= 90 && player.y - this.y >= -60 && player.y - this.y <= 70 ){

               this.x = -400;
               this.y = -400;
               prizeNum += 1 ;
              
               if(prizeNum % 3 === 0) allPrizes.forEach(prize => setTimeout(() => prize.reset(),Math.floor(Math.random() * 5000)));
               // add the points only before getting the key
               if(player.score < 100000){
                   player.score += this.sprite === 'images/Gem Blue.png' ? 1000 : 
                   this.sprite === 'images/Gem Green.png' ? 2000 : 
                   this.sprite === 'images/Gem Orange.png' ? 3000 : 
                   this.sprite === 'images/Heart.png' ? 0 : 
                   this.sprite === 'images/Key.png' ? 50000 : player.score;
               }
              
               this.update();
               points.innerHTML = player.score;       
              
               const coinSound = new Audio('sounds/coin.mp3');
               coinSound.volume = 0.2;
               coinSound.play();

               //if(player.score >= 100000) coinSound.pause();

               
            }
     }
}

let prizeNum = 0;
// instaniating a player
const player = new Player(200,380);
// creating an array of player characters that casn start game
const playerCharacters = [...document.querySelectorAll('.player')];
// if any character clicked it will be choosed to be our player
playerCharacters.forEach(character => character.addEventListener('click', Player.choosePlayer));



// Position "y" where the enemies will are created
const enemiesY = [50, 140, 220];
// creating an array of enemies 
const allEnemies = enemiesY.map(y => new Enemy(0, y,'images/enemy-bug.png', Enemy.changeSpeed()));

const  stonesY = [50,140,220,300];

const allStones = stonesY.map(y => new Enemy(0, y,'images/Rock.png', Enemy.changeSpeed()));

const prizeEntities = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];

const allPrizes = prizeEntities.map(prize => new Prize(null,null,prize));

const Heart = new Prize(null, null, 'images/Heart.png');

const key = new Prize(420,50,'images/Key.png');

let mainMusic = new Audio('sounds/main.mp3');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.


 function detectKey(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}

document.addEventListener('keyup', detectKey);


// when click start game button 
function startGame() {
    // showing canvas when click Start Game button
    const starter = document.querySelector('.starter');
    const staticsPanel = document.querySelector('.statics');
    starter.style.display = 'none';
    ctx.canvas.style.display = 'block';
    staticsPanel.style.display = 'block';
    //start main game music
    //const mainMusic = new Audio('sounds/main.mp3');
    mainMusic.volume = 0.2;
    // repeating the music while the player is alive
    mainMusic.loop = 'loop';
    //audio.muted = true;
    mainMusic.play();

}

document.querySelector('.start-button').addEventListener('click',startGame);


