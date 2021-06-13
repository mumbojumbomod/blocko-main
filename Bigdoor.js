import Phaser from 'phaser'
export default class Bigdoor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y)
  }
}



/*gameState.doorObjects.forEach(doorObject => {
  const door = gameState.hunkyDOORy.create(doorObject.x, doorObject.y - doorObject.height, 'door').setOrigin(0, 0).setPipeline('Light2D')
  door.y -= 55
  gameState.this.physics.add.overlap(gameState.player, gameState.hunkyDOORy, () => {
    if (gameState.cursors.shift.isDown) {
      gameState.hunkyDOORy.children.iterate(function (bub) {
        bub.anims.play('dooranim', true)
        let timer = gameState.this.time.addEvent({
          delay: 350,
          callback: () => {
            bub.anims.play('dooranim', false)
            gameState.this.cameras.main.fade(800, 0, 0, 0, false, function (camera, progress) {
              if (progress > .9) {
                console.log('makeDaScene den ChangeDaScene')
              }
            });
          }
        })
      })
    }
  });

})*/
export { Bigdoor }
