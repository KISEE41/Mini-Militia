import { BackgroundObject, Platform, backgroundImage } from './environment.js';
import { playerCreation } from './player.js';
import { keys, facingDirection, projectiles, mousePosition } from './keyEventListener.js';
import { detectCollisionSide, isCollidedWith } from './collision.js';
import { spawnEnemies, enemies } from './enemies.js';
import { pointingTarget } from './targetIcon.js';
import { indicator } from './indicator.js'

export let player;
export let animateId;
export let animate;

function main() {
    //all the varaibles needed are defined here
    let genericObjects = [];
    let platforms = [];

    //setting up the environment
    function createEnvironment() {
        fetch("./assets/js/environment_coordinates/background.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    genericObjects.push(new BackgroundObject({
                        x: element.x,
                        y: element.y,
                        image: createImage(element.image),
                        width: element.width,
                        height: element.height
                    }
                    ));
                });
            });

        fetch("./assets/js/environment_coordinates/platform.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    platforms.push(new Platform(
                        {
                            x: element.x,
                            y: element.y,
                            width: element.width,
                            height: element.height
                        }
                    ));
                });
            })
    }

    //environment creation
    createEnvironment();

    //player creation
    player = playerCreation();

    //movement of the player
    function playerMovement() {
        //player movement with horizontal parallex effect
        if (keys.right.pressed && player.position.x <= canvas.width / 2 + 200) {
            player.velocity.x = player.speed;
        } else if (keys.left.pressed && player.position.x >= canvas.width / 2 - 200) {
            player.velocity.x = -player.speed;
        } else {
            player.velocity.x = 0;
            //parallex effect
            if (keys.right.pressed) {
                if (genericObjects[genericObjects.length - 1].position.x <= canvas.width / 2 - 200) {
                    player.velocity.x = 0;
                } else {
                    platforms.forEach(platform => {
                        platform.position.x -= player.speed;
                    })
                    genericObjects.forEach(genericObject => {
                        genericObject.position.x -= player.speed;
                    })
                }
            } else if (keys.left.pressed) {
                if (genericObjects[1].position.x >= canvas.width / 2 - 200) {
                    player.velocity.x = 0;
                } else {
                    platforms.forEach(platform => {
                        platform.position.x += player.speed;
                    });
                    genericObjects.forEach(genericObject => {
                        genericObject.position.x += player.speed;
                    })
                }
            }
        }

        //player movement with vertical parallex effect
        if (keys.up.pressed && player.position.y >= canvas.height / 4 && player.booster > 0) {
            player.velocity.y = -verticalParallexVelocity;
            player.booster = (player.booster >= 0) ? player.booster - boosterReduction : 0;
        } else if (keys.up.pressed && player.position.y <= canvas.height / 4 && player.booster > 0) {
            player.velocity.y = 0;
            player.booster = (player.booster >= 0) ? player.booster - boosterReduction : 0;
            platforms.forEach(platform => {
                platform.position.y += verticalParallexVelocity;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.y += verticalParallexVelocity;
            })
        } else if (!keys.up.pressed && genericObjects[1].position.y + genericObjects[1].height <= canvas.height) {
            player.velocity.y += gravity;
            player.booster = (player.booster >= 150) ? 150 : player.booster + boosterAddition;
            if (player.position.y + player.height >= canvas.height - 172) {
                player.velocity.y = 0;
            }
        } else if (!keys.up.pressed && genericObjects[1].position.y + genericObjects[1].height >= canvas.height) {
            player.velocity.y = 0;
            player.booster = (player.booster >= 150) ? 150 : player.booster + boosterAddition;
            platforms.forEach(platform => {
                platform.position.y -= verticalParallexVelocity;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.y -= verticalParallexVelocity;
            })
        }

        //collision detection and player response towards it
        let collidedWithPlatform = platforms.map(platform => {
            return detectCollisionSide(platform);
        });


        collidedWithPlatform.forEach(collidedPlatform => {
            if (collidedPlatform.collidedside === 'left') {
                player.position.x = collidedPlatform.platform.position.x + collidedPlatform.platform.width;
            } else if (collidedPlatform.collidedside === 'right') {
                player.position.x = collidedPlatform.platform.position.x - player.width;
            }
            else if (collidedPlatform.collidedside === 'top') {
                player.velocity.y = 0;
                if (player.position.y <= collidedPlatform.platform.position.y + collidedPlatform.platform.height) {
                    player.position.y = collidedPlatform.platform.position.y + collidedPlatform.platform.height + 1;
                }
            }
            else if (collidedPlatform.collidedside === 'bottom') {
                player.velocity.y = 0;
                if (player.position.y + player.height >= collidedPlatform.platform.position.y) {
                    player.position.y = collidedPlatform.platform.position.y - player.height - 1;
                }
            }
        })

        //image sprite animation with respect to mouse pointer and key pressed
        if (facingDirection === "right" && keys.right.pressed && !keys.up.pressed && player.currentSprite !== player.sprites.run.right) {
            // console.log("running right")
            player.frames = 0;
            player.currentSprite = player.sprites.run.right;
            player.currentCropHeight = player.sprites.run.cropHeight;
            player.boosterHeight = player.sprites.run.boosterHeight;
        } else if (facingDirection === "left" && keys.left.pressed && !keys.up.pressed && player.currentSprite !== player.sprites.run.left) {
            // console.log("running left")
            player.frames = 0;
            player.currentSprite = player.sprites.run.left;
            player.currentCropHeight = player.sprites.run.cropHeight;
            player.boosterHeight = player.sprites.run.boosterHeight;
        }
        else if (facingDirection === "right" && (!keys.right.pressed && !keys.left.pressed) && !keys.up.pressed && player.currentSprite !== player.sprites.stand.right) {
            // console.log("standing right")
            player.frames = 0;
            player.currentSprite = player.sprites.stand.right;
            player.currentCropHeight = player.sprites.stand.cropHeight;
            player.boosterHeight = player.sprites.stand.boosterHeight
        } else if (facingDirection === "left" && (!keys.right.pressed && !keys.left.pressed) && !keys.up.pressed && player.currentSprite !== player.sprites.stand.left) {
            // console.log("standing left")
            player.frames = 0;
            player.currentSprite = player.sprites.stand.left;
            player.currentCropHeight = player.sprites.stand.cropHeight;
            player.boosterHeight = player.sprites.stand.boosterHeight
        } else if (facingDirection === 'right' && keys.left.pressed && !keys.up.pressed && player.currentSprite !== player.sprites.run.right) {
            player.frames = 0;
            player.currentSprite = player.sprites.run.right;
            player.currentCropHeight = player.sprites.run.cropHeight;
            player.boosterHeight = player.sprites.run.boosterHeight;
        } else if (facingDirection === 'left' && keys.right.pressed && !keys.up.pressed && player.currentSprite !== player.sprites.run.left) {
            player.frames = 0;
            player.currentSprite = player.sprites.run.left;
            player.currentCropHeight = player.sprites.run.cropHeight;
            player.boosterHeight = player.sprites.run.boosterHeight;
        } else if (facingDirection === 'right' && keys.up.pressed && player.booster > 10 && player.currentSprite !== player.sprites.fly.right) {
            player.frames = 0;
            player.currentSprite = player.sprites.fly.right;
            player.currentCropHeight = player.sprites.fly.cropHeight;
            player.boosterHeight = player.sprites.fly.boosterHeight;
        } else if (facingDirection === 'left' && keys.up.pressed && player.booster > 10 && player.currentSprite !== player.sprites.fly.left) {
            player.frames = 0;
            player.currentSprite = player.sprites.fly.left;
            player.currentCropHeight = player.sprites.fly.cropHeight;
            player.boosterHeight = player.sprites.fly.boosterHeight;
        }

        player.update();
    }

    animate = () => {
        animateId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //drawing main background 
        backgroundImage.draw();

        // //drawing background images
        genericObjects.forEach(Object => {
            Object.draw();
        });

        //drawing projectiles/bullet
        projectiles.forEach((projectile, projectileIndex) => {
            projectile.update();

            //remove from edges of screen
            if ((projectile.position.x - projectile.position.radius < 0) ||
                (projectile.position.x + projectile.position.radius > canvas.width) ||
                (projectile.position.y + projectile.position.radius < 0) ||
                (projectile.position.y - projectile.position.radius > canvas.height)
            ) {
                setTimeout(() => {
                    projectiles.splice(projectileIndex, 1);
                }, 0);
            }

            platforms.forEach(platform => {
                if (isCollidedWith(projectile, platform)) projectiles.splice(projectileIndex, 1);
            });
        });

        //tracking movement of player
        playerMovement();

        // //invisible platform for collision
        platforms.forEach(Object => {
            Object.draw();
        });

        //drawing enemies
        enemies.forEach((enemy, enemyIndex) => {
            enemy.update();

            const dist = Math.hypot(player.position.x - enemy.x, player.position.y - enemy.y);

            if (isCollidedWith(player, enemy)) {
                cancelAnimationFrame(animateId);
            }

            projectiles.forEach((projectile, projectileIndex) => {
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

                if (isCollidedWith(projectile, enemy)) {
                    projectiles.splice(projectileIndex, 1);
                    if (enemy.lifeSpan >= 10) {
                        enemy.lifeSpan = enemy.lifeSpan - (3 * lifeReductionWhenHit);
                        if (enemy.lifeSpan <= 0) enemy.lifeSpan = 0;
                    } else {
                        setTimeout(() => {
                            enemies.splice(enemyIndex, 1);
                        }, 0);
                    }
                }
            });
        })

        //drawing pointing scope
        pointingTarget(mousePosition.x, mousePosition.y);

        //indicator
        indicator();
    }


    //spawning enemies
    spawnEnemies();

    //looping of game
    animate();
}

main();