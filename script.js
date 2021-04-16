class Level extends Phaser.Scene {

  constructor(key) {
    super({ key: 'Level' });
  }
  preload() {
    this.load.spritesheet('robodude', 'playermove.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodude2', 'playermove2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodudenodust', 'movenodust.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodudenodust2', 'movenodust2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('shooting', 'shooting.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('shooting2', 'shooting2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.image('bullet', 'bullet.png');
  }
  create() {
    gameState.this = this
    gameState.lastFired = 0;
    let bullets;
    this.createAnimations()
    gameState.player = this.physics.add.sprite(100, 100, 'robodude')
    var Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize:
        function Bullet(scene) {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
          this.speed = Phaser.Math.GetSpeed(400, 1);
        },
      fire: function (x, y) {
        this.setPosition(x - 20, y);
        this.setActive(true);
        this.setVisible(true);
      },
      update: function (time, delta) {
        this.x += this.speed * delta;
        this.setScale(2)
        let timer = gameState.this.time.addEvent({
          delay: 400,
          callback: () => {
            this.setActive(false);
            this.setVisible(false);
            this.destroy()
          }
        })
      }
    });
    gameState.bullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true
    });
    let bulletsF;
    var BulletF = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize:
        function BulletF(scene) {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
          this.speed = Phaser.Math.GetSpeed(400, 1);
        },
      fireF: function (x, y) {
        this.setPosition(x - 40, y);
        this.setActive(true);
        this.setVisible(true);
      },
      update: function (time, delta) {
        this.x -= this.speed * delta;
        this.setScale(2)
        let timer = gameState.this.time.addEvent({
          delay: 450,
          callback: () => {
            this.setActive(false);
            this.setVisible(false);
            this.destroy()
          }
        })
      }
    });
    gameState.bulletsF = this.add.group({
      classType: BulletF,
      maxSize: 10,
      runChildUpdate: true
    });
    gameState.player.body.setSize(gameState.player.width - 100, gameState.player.height - 3).setOffset(15, 3);
    gameState.player.setCollideWorldBounds()
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.active = true
    gameState.flip = false
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
      key: 'notF',
      frames: this.anims.generateFrameNumbers('robodudenodust2', { start: 3, end: 4 }),
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
      key: 'jumpF',
      frames: this.anims.generateFrameNumbers('robodudenodust2', { start: 7, end: 7 }),
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
      repeat: -1,
    });
    this.anims.create({
      key: 'shootF',
      frames: this.anims.generateFrameNumbers('shooting2', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update(time, delta) {
    if (gameState.active) {
      if (gameState.cursors.right.isDown) {
        //gameState.player.flipX = false;
        gameState.flip = false
        //gameState.player.setOffset(16, 0);
        gameState.player.setVelocityX(100);
        gameState.player.anims.play('run', true);
      } else if (gameState.cursors.left.isDown) {
        //gameState.player.flipX = true;
        //gameState.player.setOffset(17 * 5, 0);
        gameState.flip = true
        gameState.player.setVelocityX(-100);
        gameState.player.anims.play('runF', true);
      } else if (gameState.cursors.space.isDown) {
        if (gameState.flip === true && time > gameState.lastFired) {
          gameState.player.anims.play('shootF', true);
          gameState.player.setVelocityX(0);
          var bulletF = gameState.bulletsF.get();
          if (bulletF) {
            bulletF.fireF(gameState.player.x, gameState.player.y);
            gameState.lastFired = time + 500;
          }
        } else if (gameState.flip === false && time > gameState.lastFired) {
          gameState.player.anims.play('shoot', true);
          gameState.player.setVelocityX(0);
          var bullet = gameState.bullets.get();
          if (bullet) {
            bullet.fire(gameState.player.x, gameState.player.y);
            gameState.lastFired = time + 500;
          }
        }
      } else {
        if (gameState.flip === true) {
          gameState.player.setVelocityX(0);
          gameState.player.anims.play('notF', true);
        } else {
          gameState.player.setVelocityX(0);
          gameState.player.anims.play('not', true);
        }
      }
      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && gameState.player.body.onFloor()) {
        if (gameState.flip === true) {
          gameState.player.anims.play('jumpF', true);
          gameState.player.setVelocityY(-500);
        } else {
          gameState.player.anims.play('jump', true);
          gameState.player.setVelocityY(-500);
        }
      }
      if (!gameState.player.body.onFloor()) {
        if (gameState.flip === true) {
          gameState.player.anims.play('jumpF', true);
        } else {
          gameState.player.anims.play('jump', true);
        }
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