import { player } from './main.js';
import { Projectile } from './bullet.js';
import { pointingTarget } from './targetIcon.js';

export let facingDirection = 'right';

export const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
}

export const mousePosition = {
    x: 0,
    y: 0
}

export let mousePointingAngle = 0;
// let lastKey;

export let projectiles = [];

//for keypressed
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = true;
            // lastKey = 'left';
            break;
        case 68:
            keys.right.pressed = true;
            // lastKey = 'right';
            break;
        case 87:
            // player.velocity.y -= 2;
            keys.up.pressed = true;
            // lastKey = 'up';
            break;
        case 83:
            player.velocity.y += 2;
            keys.down.pressed = true;
            // lastKey = 'down';
            break;
    }
});

//for keydown
addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            keys.left.pressed = false;
            break;
        case 68:
            keys.right.pressed = false;
            break;
        case 87:
            keys.up.pressed = false;
            break;
        case 83:
            keys.down.pressed = false;
            break;
    }
});


//tracking of mouse pointer
addEventListener('mousemove', (event) => {
    mousePosition.x = event.offsetX;
    mousePosition.y = event.offsetY;

    if (mousePosition.x <= player.position.x + player.width / 2) facingDirection = 'left';
    else if (mousePosition.x >= player.position.x + player.width / 2) facingDirection = 'right';

    mousePointingAngle = Math.atan2(mousePosition.y - (player.position.y + player.height / 1.6), mousePosition.x - (player.position.x + player.width / 2.6));
})

//shoot the projectile
addEventListener('click', (event) => {
    const angle = player.playerHand.firingAngle(event.clientX, event.clientY);

    const velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed
    }

    projectiles.push(new Projectile(
        player.position.x + player.playerHand.weaponPosition.x + player.playerHand.gun.handGun.width / 2,
        player.position.y + player.playerHand.weaponPosition.y + player.playerHand.gun.handGun.height / 2,
        5, 'gold', velocity)
    );
})

