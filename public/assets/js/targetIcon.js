var image = createImage('./assets/images/gun-target.png');
var targetWidth = 100;
var targetHeight = 100;

export function pointingTarget(x, y) {
    ctx.drawImage(image, x - targetWidth / 2, y - targetHeight / 2, targetWidth, targetHeight);
}