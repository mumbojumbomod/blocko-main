//import Bigdoor from './Bigdoor.js'
class Level extends Phaser.Scene {

  constructor(key) {
    super({ key: 'Level' });
  }
  preload() {
    this.load.spritesheet('robodude', 'playermove.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('spites', 'spites.png', { frameWidth: 8, frameHeight: 16 });
    this.load.spritesheet('spitesD', 'spitesD.png', { frameWidth: 8, frameHeight: 16 });
    this.load.spritesheet('robodude2', 'playermove2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodudenodust', 'movenodust.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('robodudenodust2', 'movenodust2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('shooting', 'shooting.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('shooting2', 'shooting2.png', { frameWidth: 117, frameHeight: 26 });
    this.load.spritesheet('wake', 'wake.png', { frameWidth: 117, frameHeight: 26 });
    this.load.image('bullet', 'bullet.png');
    this.load.image('tiles', ['derelict_spacecraft_tiles.png', 'NormalMap.png']);
    this.load.image('bg1', 'parallax/parallax1.png');
    this.load.image('bg2', 'parallax/parallax2.png');
    this.load.image('bg3', 'parallax/parallax3.png');
    this.load.image('bg4', 'parallax/parallax4.png');
    this.load.image('bg5', 'parallax/parallax5.png');
    this.load.image('door', 'doordoo.png');
    this.load.image('H0', 'H/H0.png');
    this.load.image('H1', 'H/H1.png');
    this.load.image('H2', 'H/H2.png');
    this.load.image('H3', 'H/H3.png');
    this.load.image('H4', 'H/H4.png');
    this.load.image('HF', 'H/HF.png');
    this.load.image('numH', 'H/num.png');
    this.load.image('saberdude', 'saber/saberdude.png');
    this.load.spritesheet('idle', 'saber/idle.png', { frameWidth: 121, frameHeight: 70 });
    this.load.spritesheet('dooranim', 'dooropening.png', { frameWidth: 48, frameHeight: 64 });
    this.load.spritesheet('quickspin', 'saber/quick spin attack.png', { frameWidth: 121, frameHeight: 70 });
    this.load.spritesheet('wlak', 'saber/move.png', { frameWidth: 40, frameHeight: 70 });
    this.load.tilemapTiledJSON('map', 'untitled.json');
  }
  create() {
    //alert("dead!!");

    this.createParallaxBackgrounds()
    this.lights.enable()//.setAmbientColor(0xffffff);
    gameState.this = this
    gameState.lastFired = 0;
    let bullets;
    this.createAnimations()
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('derelict_spacecraft_tiles', 'tiles');
    const backgrounds = map.createLayer('backgrounds', tileset).setPipeline('Light2D')
    gameState.platforms = map.createLayer('platforms', tileset, 0, 0).setPipeline('Light2D')//.setScale(0.9);
    gameState.platforms.setCollisionByExclusion(-1, true);
    gameState.player = this.physics.add.sprite(0, 0, 'robodude').setPipeline('Light2D')
    gameState.player.depth = 100
    //gameState.playerLight = this.lights.addLight(200, 0, 100, 0xffff00, 3.3)
    this.physics.add.collider(gameState.player, gameState.platforms);

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

    gameState.bullets = this.physics.add.group({
      allowGravity: false,
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true
    });
    this.physics.add.collider(gameState.bullets, gameState.platforms, () => { console.log('clang!') });
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
    gameState.bulletsF = this.physics.add.group({
      allowGravity: false,
      classType: BulletF,
      maxSize: 10,
      runChildUpdate: true
    });
    this.physics.add.collider(gameState.bulletsF, gameState.platforms, () => { console.log('Clang!!') });
    gameState.player.body.setSize(gameState.player.width - 100, gameState.player.height - 3).setOffset(15, 3);
    gameState.player.setCollideWorldBounds()
    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.active = true
    gameState.flip = false
    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    this.cameras.main.setBounds(0, 0, 3000, 1000);
    this.physics.world.setBounds(0, 0, 3000, 1100);
    gameState.spites = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const spitesObjects = map.getObjectLayer('spites')['objects'];
    spitesObjects.forEach(spitesObject => {
      const spite = gameState.spites.create(spitesObject.x, spitesObject.y - spitesObject.height, 'spites').setOrigin(0, 0).setPipeline('Light2D');
    });
    spitesObjects.forEach(ject => {
      this.lights.addLight(ject.x, ject.y, 100, 0xffff00, 2.3)
    })
    gameState.HP = this.add.sprite(470, 20, 'HF').setScrollFactor(0)
    gameState.HPnum = this.add.sprite(420, 20, 'numH').setScrollFactor(0)
    gameState.HPint = 1000
    this.physics.add.overlap(gameState.player, gameState.spites, () => {
      gameState.HPint--
    });
    gameState.spitesD = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const spitesObjectsD = map.getObjectLayer('spitesD')['objects'];
    spitesObjectsD.forEach(spitesObjectD => {
      const spite = gameState.spitesD.create(spitesObjectD.x, spitesObjectD.y - spitesObjectD.height, 'spitesD').setOrigin(0, 0).setPipeline('Light2D');
    });
    spitesObjectsD.forEach(ject => {
      this.lights.addLight(ject.x, ject.y, 100, 0xffff00, 2.3)
    })
    this.physics.add.overlap(gameState.player, gameState.spitesD, () => {
      gameState.HPint--
    });
    const frontA = map.createLayer('frontA', tileset).setPipeline('Light2D')
    gameState.HPtext = this.add.text(411, 18, '1000', { fontSize: '8px', fill: '#00a808' }).setScrollFactor(0);
    ///enemies
    gameState.saber = this.physics.add.group({
      allowGravity: true,
      immovable: true,
    });
    this.physics.add.collider(gameState.saber, gameState.platforms);
    gameState.saberObjects = map.getObjectLayer('saber3')['objects'];
    gameState.tribot = gameState.saberObjects.map(saberObject => {
      let saber = gameState.saber.create(saberObject.x, saberObject.y - saberObject.height, 'appear').setOrigin(0, 0).setPipeline('Light2D')
      saber.body.setSize(saber.width + 50, saber.height).setOffset(-20, 34);
      saber.y -= 50
      saber.x -= 50
      return saber
    });

    gameState.saber.children.iterate(function (sab) {
      sab.anims.play('wlak', true)
      const moveTween = gameState.this.tweens.add({
        targets: sab,
        x: '+=100',
        ease: 'Linear',
        flipX: true,
        duration: 1666,
        repeat: -1,
        yoyo: true,
      });
      sab.once('attack', () => {
        sab.anims.play('wlak', false)
        moveTween.stop()
        sab.setTint(0xffffff);
        sab.body.setSize(32 + 70, 32).setOffset(+15, 34);
        sab.x -= 50;
        let lite = gameState.this.lights.addLight(sab.x + 50, sab.y, 100, 0xff0019, 2)
        sab.anims.play('quickspin', true)
        console.log('is called?')
        let timer2 = gameState.this.time.addEvent({
          delay: 100,
          callback: () => {
            //lite.setActive(false);
            lite.setVisible(false);
          }
        })
      });
      gameState.this.physics.add.overlap(gameState.player, sab, () => {
        sab.emit('attack')
        gameState.HPint--
      });
    })
    const doors = this.physics.add.group({

    })
    //doors.get(200, 200, '../Bigdoor.door')
  }

  createParallaxBackgrounds() {
    gameState.bg1 = this.add.image(0, 0, 'bg1').setScale(5);
    gameState.bg2 = this.add.image(0, 0, 'bg2').setScale(5);
    gameState.bg4 = this.add.image(0, 0, 'bg4').setScale(5);
    gameState.bg3 = this.add.image(0, 0, 'bg3').setScale(5);
    gameState.bg5 = this.add.image(0, 0, 'bg5').setScale(5);

    gameState.bg1.setOrigin(0, 0);
    gameState.bg2.setOrigin(0, 0);
    gameState.bg3.setOrigin(0, 0);
    gameState.bg4.setOrigin(0, 0);
    gameState.bg5.setOrigin(0, 0);

    const game_width = 3000//parseFloat(gameState.bg3.getBounds().width)
    gameState.width = game_width;
    const window_width = config.width

    const bg1_width = gameState.bg1.getBounds().width
    const bg2_width = gameState.bg2.getBounds().width
    const bg3_width = gameState.bg3.getBounds().width
    const bg4_width = gameState.bg4.getBounds().width
    const bg5_width = gameState.bg5.getBounds().width
    gameState.bg4.setScrollFactor((bg4_width - window_width) / (game_width - window_width));
    gameState.bg5.setScrollFactor((bg5_width - window_width) / (game_width - window_width));
    gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));
    gameState.bg3.setScrollFactor((bg3_width - window_width) / (game_width - window_width));
    gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
  }

  createAnimations() {
    this.anims.create({
      key: 'dooranim',
      frames: this.anims.generateFrameNumbers('dooranim', { start: 0, end: 14 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'quickspin',
      frames: this.anims.generateFrameNumbers('quickspin', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'wlak',
      frames: this.anims.generateFrameNumbers('wlak', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'spitesAnim',
      frames: this.anims.generateFrameNumbers('spites', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'spitesAnimD',
      frames: this.anims.generateFrameNumbers('spitesD', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
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
    this.anims.create({
      key: 'wake',
      frames: this.anims.generateFrameNumbers('wake', { start: 0, end: 4 }),
      frameRate: 4,
      repeat: -1
    });
  }

  update(time, delta) {
    gameState.saber.children.iterate(function (sab) {
      let enimGoal = gameState.player.x - 100;
      if (enimGoal > sab.x) {
        sab.setVelocityX(+80)
      } else if (enimGoal < sab.x) {
        sab.setVelocityX(-80)
      } else if (enimGoal = sab.x) {
        sab.setVelocityX(0)
      }
    })
    gameState.HPtext.setText(gameState.HPint)
    if (gameState.HPint < 1000) {
      gameState.HPtext.x = 413
    }
    if (gameState.HPint < 100) {
      gameState.HPtext.x = 415.5
    }
    if (gameState.HPint < 10) {
      gameState.HPtext.x = 418
    }
    if (gameState.HPint === 800) {
      gameState.HP = this.add.sprite(470, 20, 'H4').setScrollFactor(0)
    }
    if (gameState.HPint === 600) {
      gameState.HP = this.add.sprite(470, 20, 'H3').setScrollFactor(0)
    }
    if (gameState.HPint === 400) {
      gameState.HP = this.add.sprite(470, 20, 'H2').setScrollFactor(0)
    }
    if (gameState.HPint === 200) {
      gameState.HP = this.add.sprite(470, 20, 'H1').setScrollFactor(0)
    }
    if (gameState.HPint === 0) {
      gameState.HP = this.add.sprite(470, 20, 'H0').setScrollFactor(0)
    }
    gameState.spites.children.iterate(function (child) {
      child.anims.play('spitesAnim', true);
    });
    gameState.spitesD.children.iterate(function (child) {
      child.anims.play('spitesAnimD', true);
    });
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
          bulletF.setPipeline('Light2D')
          if (bulletF) {
            bulletF.fireF(gameState.player.x, gameState.player.y);
            gameState.lastFired = time + 500;

          }
        } else if (gameState.flip === false && time > gameState.lastFired) {
          gameState.player.anims.play('shoot', true);
          gameState.player.setVelocityX(0);
          var bullet = gameState.bullets.get();
          bullet.setPipeline('Light2D')
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