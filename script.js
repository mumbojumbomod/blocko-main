class Level extends Phaser.Scene {

  constructor(key) {
    super({ key: 'Level' });
  }
  preload() {
    this.load.spritesheet('robodude', 'playermove.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodude2', 'playermove2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('charging', 'charge.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodudenodust', 'movenodust.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('shooting', 'shooting.png', { frameWidth: 117, frameHeight: 26 });

    this.load.image('lantern', 'lantern.png');
  }
  create() {
    this.createAnimations()
    gameState.player = this.physics.add.sprite(100, 100, 'robodude')
    gameState.player.body.setSize(gameState.player.width - 100, gameState.player.height - 3).setOffset(15, 3);
    gameState.player.setCollideWorldBounds()
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.active = true

  }
  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('robodude', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'not',
      frames: this.anims.generateFrameNumbers('robodudenodust', { start: 3, end: 4 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('robodudenodust', { start: 7, end: 7 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: 'runF',
      frames: this.anims.generateFrameNumbers('robodude2', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers('shooting', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update() {
    if (gameState.active) {
      if (gameState.cursors.right.isDown) {
        //gameState.player.flipX = false;
        //gameState.player.setOffset(16, 0);
        gameState.player.setVelocityX(100);
        gameState.player.anims.play('run', true);
      } else if (gameState.cursors.left.isDown) {
        //gameState.player.flipX = true;
        //gameState.player.setOffset(17 * 5, 0);
        gameState.player.setVelocityX(-100);
        gameState.player.anims.play('runF', true);
      } else if (gameState.cursors.space.isDown) {
        gameState.player.anims.play('shoot', true);
        gameState.player.setVelocityX(0);
        /*
                gameState.player.anims.play('charge', true);
                let timer = this.time.addEvent({
                  delay: 1000,
                  callback: () => {
                    gameState.player.anims.play('shoot', true);
                    gameState.player.setVelocityX(0);
                  }
                })*/
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('not', true);
      }
      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && gameState.player.body.onFloor()) {
        gameState.player.anims.play('jump', true);
        gameState.player.setVelocityY(-500);
      }
      if (!gameState.player.body.onFloor()) {
        gameState.player.anims.play('jump', true);
      }
    }
  }
}

const gameState = {};
const config = {
  type: Phaser.WEBGL,
  width: 500,
  height: 600,
  scale: { mode: Phaser.Scale.FIT },
  fps: { target: 60 },
  backgroundColor: "#ffffff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      enableBody: true,
      debug: true,

    }
  },
  scene: [Level]
};

const game = new Phaser.Game(config);