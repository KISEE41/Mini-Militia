import { player } from "./main.js";

export function detectCollisionSide(platform) {
    var dx = (platform.position.x + platform.width / 2) - (player.position.x + player.width / 2);
    var dy = (platform.position.y + platform.height / 2) - (player.position.y + player.height / 2);
    var width = (platform.width + player.width) / 2;
    var height = (platform.height + player.height) / 2;
    var crossWidth = width * dy;
    var crossHeight = height * dx;
    var collision = 'none';

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        } else {
            collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
        }
    }

    return ({ platform: platform, collidedside: collision });
}

export function isCollidedWith(obj1, obj2) {
    return (
        (obj1.position.x + obj1.width > obj2.position.x) &&
        (obj1.position.x < obj2.position.x + obj2.width) &&
        (obj1.position.y + obj1.height > obj2.position.y) &&
        (obj1.position.y < obj2.position.y + obj2.height)
    )
}