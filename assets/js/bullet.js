export class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.width = radius * 2;
        this.height = radius * 2;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}