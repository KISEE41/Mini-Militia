import { player } from "./main.js";

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}


export const enemies = [];

export function spawnEnemies() {
    setInterval(() => {
        const x = randomIntFromRange(0, canvas.width);
        const y = randomIntFromRange(-canvas.height * 2, -canvas.height * 3);
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
    }, 3000);
}