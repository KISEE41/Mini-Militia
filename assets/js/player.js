import { facingDirection, mousePointingAngle } from "./keyEventListener.js";

class Hand {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.width = 25;
        this.height = 55;
        this.rotationAngle = 0;

        this.handSprites = {
            leftArm: {
                image: createImage('./assets/images/left_arm.png')
            },
            rightArm: {
                image: createImage('./assets/images/right_arm.png')
            }
        }

        this.gun = {
            handGun: {
                left: createImage('./assets/images/hand_gun-left.png'),
                right: createImage('./assets/images/hand_gun-right.png'),
                width: 25,
                height: 50
            }
        }

        this.handImage = this.handSprites.rightArm.image;
        this.weapon = this.gun.handGun.right;

        this.weaponPosition = {
            x: 0,
            y: 0
        }
    }

    update() {
        if (facingDirection === 'right') {
            this.position.x = player.position.x + player.width * 1 / 4 + 5;
            this.position.y = player.position.y + player.height / 2 + 1;
            this.rotationAngle = mousePointingAngle - Math.PI / 2 + 0.35;

            this.handImage = this.handSprites.rightArm.image;
            this.weapon = this.gun.handGun.right;
            this.weaponPosition.x = this.width / 2 + 8, this.height / 2 + 13;
            this.weaponPosition.y = this.height / 2 + 13;
        }
        else if (facingDirection === 'left') {
            this.position.x = player.position.x + player.width * 2 / 3;
            this.position.y = player.position.y + player.height / 2 - 7;
            this.rotationAngle = mousePointingAngle + Math.PI * 3 / 2 + 0.1;

            this.handImage = this.handSprites.leftArm.image;
            this.weapon = this.gun.handGun.left;
            this.weaponPosition.x = -2;
            this.weaponPosition.y = this.height / 2 + 22;
        }
    }

    firingAngle(mouseX, mouseY) {
        if (facingDirection === 'right') {
            return (Math.atan2(
                mouseY - this.position.y + player.height / 15,
                mouseX - this.position.x - player.width / 15
            ))
        } else if (facingDirection === 'left') {
            return (Math.atan2(
                mouseY - this.position.y - player.height / 15,
                mouseX - this.position.x + player.width * 2 / 3 - 10
            ))
        }
    }

    draw() {
        ctx.save();
        this.update();
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotationAngle);
        // ctx.fillStyle = 'yellow';
        // ctx.fillRect(0, 0, this.width, this.height);
        ctx.drawImage(this.weapon, this.weaponPosition.x, this.weaponPosition.y, this.gun.handGun.width, this.gun.handGun.height);
        ctx.drawImage(this.handImage, 0, 0, this.width, this.height);
        ctx.closePath();
        ctx.restore();
    }
}


class Player {
    constructor(x = canvas.width / 2, y = 10) {
        this.position = {
            x: x,
            y: y
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 95;
        this.height = 152;
        this.speed = 2;

        this.booster = boosterLimit;
        this.playerLifeSpan = playerLifeLimit;

        this.frames = 0;
        this.holdFrame = 24;
        this.frameCount = 0;

        this.sprites = {
            stand: {
                right: createImage('./assets/images/character-right-standing.png'),
                left: createImage('./assets/images/character-left-standing.png'),
                cropHeight: 150,
                boosterHeight: 0
            },
            run: {
                right: createImage('./assets/images/character-right-walking.png'),
                left: createImage('./assets/images/character-left-walking.png'),
                cropHeight: 152,
                boosterHeight: 0
            },
            fly: {
                right: createImage('./assets/images/character-right-flying.png'),
                left: createImage('./assets/images/character-left-flying.png'),
                cropHeight: 210,
                boosterHeight: 30
            }
        }

        this.currentSprite = this.sprites.stand.left;
        this.currentCropHeight = this.sprites.stand.cropHeight;
        this.boosterHeight = this.sprites.stand.boosterHeight;

        this.playerHand = new Hand();
    }

    draw() {
        // ctx.beginPath();
        // ctx.rect(this.position.x, this.position.y, this.width, this.height);
        // ctx.fillStyle = 'red';
        // ctx.fill();
        ctx.drawImage(
            this.currentSprite,
            this.width * this.frames,
            0 - this.boosterHeight,
            this.width,
            this.currentCropHeight,
            this.position.x,
            this.position.y - this.boosterHeight,
            this.width,
            this.currentCropHeight
        )

        this.playerHand.draw();
    }

    update() {
        this.draw();
        if (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left) {
            this.frame = 0;
        } else {
            this.frameCount++;

            if ((this.frameCount / this.holdFrame) === 1) {
                this.frames++;
                this.frameCount = 0;
                if (this.frames >= 4) {
                    this.frames = 1;
                }
            }
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height - 172) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }

    }
}


export let player;
//singleton design pattern
export function playerCreation() {
    if (player === undefined) {
        player = new Player();
        return player;
    }
    return player;
}