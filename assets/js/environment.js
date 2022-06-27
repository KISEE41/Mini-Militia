export class BackgroundObject {
    constructor({ x, y, image, width, height }) {
        this.position = {
            x,
            y
        }

        this.image = image
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}


export class Platform {
    constructor({ x, y, width, height }) {
        this.position = {
            x,
            y,
        }

        this.width = width;
        this.height = height;

    }

    draw() {
        // ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        // ctx.beginPath();
        // ctx.rect(this.position.x, this.position.y, this.width, this.height);
        // ctx.strokeStyle = 'yellow';
        // ctx.stroke();
    }
}

export const backgroundImage = new BackgroundObject(
    {
        x: 0,
        y: 0,
        image: createImage('./assets/images/background.jpg'),
        width: canvas.width,
        height: canvas.height
    },
);
