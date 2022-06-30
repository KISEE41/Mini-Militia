import { player } from "./main.js";

class EnemyWeapon {
    /**
     * gun carrying by the robot unit
     */
    constructor() {
        this.weapons = {
            left: createImage('./assets/images/gun-r-left.png'),
            right: createImage('./assets/images/gun-right.png'),
        }

        this.width = 55;
        this.height = 33;

        this.weaponPosition = {
            x: 0,
            y: 0,
        }

        this.angle = Math.PI / 2;

        this.enemyWeapon = this.weapons.right;
        this.facingDirection = 'right';

        this.bullet = [];
        this.isFire = true;
    }

    update(enemyX, enemyY, ememyWidth, enemyHeight, enemyFacingDirection) {
        this.angle = Math.atan2((this.weaponPosition.y - (player.position.y + player.height / 2)),
            (this.weaponPosition.x - (player.position.x + player.width / 2)));

        if (enemyFacingDirection === 'right') {
            this.enemyWeapon = this.weapons.right;
            this.weaponPosition.x = enemyX + 40;
            this.weaponPosition.y = enemyY + enemyHeight * 2 / 3;
            this.angle = this.angle + Math.PI;
        } else if (enemyFacingDirection === 'left') {
            this.enemyWeapon = this.weapons.left;
            this.weaponPosition.x = enemyX + ememyWidth - 30;
            this.weaponPosition.y = enemyY + enemyHeight * 2 / 3 + 10;
            this.angle = this.angle - Math.PI;
        }

        this.draw();
    }

    draw() {
        // //weapon position
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.weaponPosition.x, this.weaponPosition.y);
        ctx.rotate(this.angle);
        // ctx.rect(0, 0, this.width, this.height);
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = 'yellow';
        // ctx.stroke();
        ctx.drawImage(this.enemyWeapon, 0, 0, this.width, this.height);
        ctx.closePath();
        ctx.restore();
    }
}


class Enemy {
    /**
     * 
     * @param {number} x enemy x position 
     * @param {number} y enmey y position 
     * @param {object} velocity vector that gives the direction of player
     */
    constructor(x, y, velocity) {
        this.position = {
            x: x,
            y: y
        }
        this.width = 90;
        this.height = 80;
        this.color = 'green';
        this.velocity = velocity;
        this.lifeSpan = enemyLife;

        this.facingEDirection = 'right';

        this.sprites = {
            left: createImage('./assets/images/enemy-left.png'),
            right: createImage('./assets/images/enemy-right.png')
        }

        this.enemyImage = this.sprites.right;

        this.weapon = new EnemyWeapon();
    }

    draw() {
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.enemyImage, this.position.x, this.position.y, this.width, this.height);
        // ctx.strokeStyle = this.color;
        // ctx.stroke();
        // ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.position.x - 6, this.position.y - 20);
        ctx.lineTo(this.position.x + 94, this.position.y - 20);
        ctx.lineTo(this.position.x + 94, this.position.y - 5);
        ctx.lineTo(this.position.x - 6, this.position.y - 5);
        ctx.lineTo(this.position.x - 6, this.position.y - 20);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(this.position.x - 6, this.position.y - 20, this.lifeSpan * 2, 15);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();


    }
    update() {
        this.draw();
        if (this.facingEDirection === 'right') {
            this.enemyImage = this.sprites.right;
        } else if (this.facingEDirection === 'left') {
            this.enemyImage = this.sprites.left;
        }

        this.weapon.update(this.position.x, this.position.y, this.width, this.height, this.facingEDirection);

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 180) {
            this.velocity.y = 0;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

    }
}


export const enemies = [];
export let enemiesSpawnInterval;


//function for spawning enemies at regular interval
export function spawnEnemies() {
    enemies.push(new Enemy(0, -canvas.height * 2, { x: 1, y: 1 }));

    enemiesSpawnInterval = setInterval(() => {

        const x = randomIntFromRange(0, canvas.width);
        const y = -randomIntFromRange(canvas.height, canvas.height * 1.2);

        const angle = Math.atan2(
            player.position.y + player.height / 2 - y,
            player.position.x + player.width / 2 - x
        )

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, velocity));

    }, 10000);
}