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

export function isCollidedWith(platform) {
    return (
        (player.position.x + player.width > platform.position.x) &&
        (player.position.x < platform.position.x + platform.width) &&
        (player.position.y + player.height > platform.position.y) &&
        (player.position.y < platform.position.y + platform.height)
    )
}