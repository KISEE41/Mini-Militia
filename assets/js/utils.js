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

function calculateAngle(obj1, obj2) {
    //destination is obj1 and source is obj2
    return (
        Math.atan2(
            obj1.position.y + obj1.height / 2 - obj2.position.y,
            obj1.position.x + obj1.width / 2 - obj2.position.x
        )
    )
}

function distanceBetween(obj1, obj2) {
    return Math.hypot(
        obj1.position.x - obj2.position.x, obj1.position.y - obj2.position.y
    )
}


function playMusic() {
    duringPlayMusic[randomIntFromRange(0, duringPlayMusic.length - 1)].play();
}