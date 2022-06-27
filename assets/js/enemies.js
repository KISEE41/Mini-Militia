import { player } from "./main.js";

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.position = {
            x: x,
            y: y
        }
        this.width = radius * 3;
        this.height = radius * 3;
        this.color = color;
        this.velocity = velocity;
        this.lifeSpan = enemyLife;
    }

    draw() {
        ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

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
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 180) {
            this.velocity.y = 0;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

    }
}


export const enemies = [];
export let enemiesSpawnInterval;

export function spawnEnemies() {
    enemiesSpawnInterval = setInterval(() => {
        const x = randomIntFromRange(0, canvas.width);
        const y = -randomIntFromRange(canvas.height, canvas.height * 1.2);
        const radius = 30;
        const color = 'green';

        const angle = Math.atan2(
            player.position.y + player.height / 2 - y,
            player.position.x + player.width / 2 - x
        )

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 5000);
}