/**
 * 
 * @param {string} imgSrc 
 * @returns image_element
 */
function createImage(imgSrc) {
    const image = new Image();
    image.src = imgSrc;
    return image;
}


/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns random_number
 */
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


/**
 * 
 * @param {radian} angle
 * @param {object} param1 point to be rotated
 * @returns rotated point
 */
function rotate({ rotationAngle, x, y }) {
    const rotatedPoint = {
        x: x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle),
        y: x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle)
    };

    return rotatedPoint;
}