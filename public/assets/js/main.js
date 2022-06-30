import { BackgroundObject, Platform, backgroundImage } from './environment.js';
import { playerCreation } from './player.js';
import { keys, facingDirection, projectiles, mousePosition, listen } from './keyEventListener.js';
import { detectCollisionSide, isCollidedWith } from './collision.js';
import { spawnEnemies, enemies, enemiesSpawnInterval } from './enemies.js';
import { pointingTarget } from './targetIcon.js';
import { indicator } from './indicator.js'
import { Projectile } from './bullet.js';

import { start, name } from './start.js';

export let player;
export let animateId;
export let animate;
export let life = 3;
export let kills = 0;


export function main() {
    //all the varaibles needed are defined here
    let genericObjects = [];
    let platforms = [];

    gameStart.play();

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

    //clearing all the instances created for playing again
    function clearInstances() {
        kills = 0;
        life = 3;
        player = undefined;
        enemies.forEach((enemy, enemyIndex) => {
            enemies.splice(enemyIndex, 1);
        })
    }

    //reseting all necessary variables
    function reset() {
        cancelAnimationFrame(animateId);
        clearInterval(enemiesSpawnInterval);

        player.position.x = canvas.width / 2;
        player.position.y = 10;
        player.playerLifeSpan = playerLifeLimit;
        player.booster = boosterLimit;

        life -= 1;
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();

        if (life <= 0) {
            async function saveName() {
                await fetch('http://localhost:3000/api/scoreboard', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name, kills: kills })
                })
            }

            if (name !== undefined) saveName();


            const text = document.createElement('h1');
            document.querySelector('body').appendChild(text);
            text.style.fontSize = '40px';
            text.style.position = 'fixed';
            text.style.top = '40%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.transition = '2s ease';
            text.style.color = 'white';
            text.innerHTML = "GAME OVER";

            const gameOverbox = document.createElement('div');
            document.querySelector('body').appendChild(gameOverbox);
            gameOverbox.style.width = '500px';
            gameOverbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            gameOverbox.style.borderRadius = '10px';
            gameOverbox.style.padding = '30px';
            gameOverbox.style.color = 'green';
            gameOverbox.style.fontSize = '20px';
            gameOverbox.style.textAlign = 'center';
            gameOverbox.style.position = 'fixed';

            const txtKill = document.createElement('h1');
            gameOverbox.appendChild(txtKill);

            txtKill.innerHTML = `Total Kills: ${kills}`;

            const clickHere = document.createElement('div');
            gameOverbox.appendChild(clickHere);
            clickHere.style.borderBottom = '1px solid green';
            clickHere.innerHTML = "click me to try again";
            clickHere.style.display = 'inline';
            clickHere.style.cursor = 'pointer';
            clickHere.addEventListener('click', () => {
                text.remove();
                gameOverbox.remove();

                clearInstances();

                setTimeout(main(), 2000);
            });


        } else if (life > 0) {
            let timeCount = 6;

            let timeCounter = setInterval(() => {
                textRespawn.innerHTML = `Respawning in ${timeCount} sec...`;
                timeCount--;
            }, 1000);

            player = undefined;
            player = playerCreation();

            const textRespawn = document.createElement('h1');
            const textKill = document.createElement('h2');
            document.querySelector('body').appendChild(textRespawn);
            document.querySelector('body').appendChild(textKill);
            textRespawn.style.fontSize = '40px';
            textRespawn.style.color = 'white';
            textRespawn.style.position = 'fixed';

            textKill.style.fontSize = '30px';
            textKill.style.color = 'red';
            textKill.style.padding = '5px';
            textKill.style.position = 'fixed';
            textKill.style.marginTop = "-80px"
            textKill.innerHTML = `Kills: ${kills}`;

            setTimeout(() => {
                clearInterval(timeCounter);
                textRespawn.remove();
                textKill.remove();
                spawnEnemies();
                requestAnimationFrame(animate);
            }, 7000);
        }
    }

    //for selecting suiting sprite
    function chooseImageSprite() {
        //image sprite animation with respect to mouse pointer and key pressed
        if (facingDirection === "right" && keys.right.pressed && !keys.up.pressed && player.currentSprite !== player.sprites.run.right) {
            player.frames = 0;
            player.currentSprite = player.sprites.run.right;
            player.currentCropHeight = player.sprites.run.cropHeight;
            player.boosterHeight = player.sprites.run.boosterHeight;
        } else if (facingDirection === "left" && keys.left.pressed && !keys.up.pressed && player.currentSprite !== player.sprites.run.left) {
            player.frames = 0;
            player.currentSprite = player.sprites.run.left;
            player.currentCropHeight = player.sprites.run.cropHeight;
            player.boosterHeight = player.sprites.run.boosterHeight;
        }
        else if (facingDirection === "right" && (!keys.right.pressed && !keys.left.pressed) && !keys.up.pressed && player.currentSprite !== player.sprites.stand.right) {
            player.frames = 0;
            player.currentSprite = player.sprites.stand.right;
            player.currentCropHeight = player.sprites.stand.cropHeight;
            player.boosterHeight = player.sprites.stand.boosterHeight
        } else if (facingDirection === "left" && (!keys.right.pressed && !keys.left.pressed) && !keys.up.pressed && player.currentSprite !== player.sprites.stand.left) {
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
        } else if (facingDirection === 'right' && keys.up.pressed && player.booster >= 10 && player.currentSprite !== player.sprites.fly.right) {
            player.frames = 0;
            player.currentSprite = player.sprites.fly.right;
            player.currentCropHeight = player.sprites.fly.cropHeight;
            player.boosterHeight = player.sprites.fly.boosterHeight;
        } else if (facingDirection === 'left' && keys.up.pressed && player.booster >= 10 && player.currentSprite !== player.sprites.fly.left) {
            player.frames = 0;
            player.currentSprite = player.sprites.fly.left;
            player.currentCropHeight = player.sprites.fly.cropHeight;
            player.boosterHeight = player.sprites.fly.boosterHeight;
        } else if (keys.up.pressed && player.booster <= 10) {
            if (facingDirection === 'right') {
                player.currentSprite = player.sprites.run.right;
                player.currentCropHeight = player.sprites.run.cropHeight;
                player.boosterHeight = player.sprites.run.boosterHeight;
            } else if (facingDirection === 'left') {
                player.currentSprite = player.sprites.run.left;
                player.currentCropHeight = player.sprites.run.cropHeight;
                player.boosterHeight = player.sprites.run.boosterHeight;
            }
        }
    }

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
                if (genericObjects[genericObjects.length - 2].position.x <= canvas.width / 2 - 200) {
                    player.velocity.x = 0;
                } else {
                    platforms.forEach(platform => {
                        platform.position.x -= player.speed;
                    })
                    genericObjects.forEach(genericObject => {
                        genericObject.position.x -= player.speed;
                    });
                    enemies.forEach(enemy => {
                        enemy.position.x -= player.speed;
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
                    });
                    enemies.forEach(enemy => {
                        enemy.position.x += player.speed;
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
            });
            enemies.forEach(enemy => {
                enemy.position.y += verticalParallexVelocity;
            })
        } else if (!keys.up.pressed && genericObjects[1] !== undefined && genericObjects[1].position.y + genericObjects[1].height >= canvas.height) {
            player.velocity.y = 0;
            player.booster = (player.booster >= 150) ? 150 : player.booster + boosterAddition;
            platforms.forEach(platform => {
                platform.position.y -= verticalParallexVelocity;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.y -= verticalParallexVelocity;
            });
            enemies.forEach(enemy => {
                enemy.position.y -= verticalParallexVelocity;
            })
        } else if (!keys.up.pressed && genericObjects[1] !== undefined && genericObjects[1].position.y + genericObjects[1].height <= canvas.height) {
            player.velocity.y += gravity;
            player.booster = (player.booster >= 150) ? 150 : player.booster + boosterAddition;
            if (player.position.y + player.height >= canvas.height - 172) {
                player.velocity.y = 0;
            }
        } else if (keys.up.pressed && genericObjects[1] !== undefined && genericObjects[1].position.y + genericObjects[1].height >= canvas.height) {
            player.velocity.y = 0;
            platforms.forEach(platform => {
                platform.position.y -= verticalParallexVelocity;
            });
            genericObjects.forEach(genericObject => {
                genericObject.position.y -= verticalParallexVelocity;
            });
            enemies.forEach(enemy => {
                enemy.position.y -= verticalParallexVelocity;
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

        chooseImageSprite();

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
            if ((projectile.position.x + projectile.width < 0) ||
                (projectile.position.x > canvas.width) ||
                (projectile.position.y < 0) ||
                (projectile.position.y - projectile.height > canvas.height - 150)
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
            if (enemy.position.x > player.position.x) enemy.facingEDirection = 'left';
            else if (enemy.position.x <= player.position.y) enemy.facingEDirection = 'right';

            platforms.forEach(platform => {
                if (isCollidedWith(platform, enemy)) {
                    enemy.velocity.x = (Math.random() > 0.5) ? 1 : -1;
                    enemy.velocity.y = -enemy.velocity.y;
                }
            })

            enemy.update();

            projectiles.forEach((projectile, projectileIndex) => {
                if (isCollidedWith(projectile, enemy)) {
                    projectiles.splice(projectileIndex, 1);
                    if (enemy.lifeSpan >= 10) {
                        enemy.lifeSpan = enemy.lifeSpan - (3 * lifeReductionWhenHit);
                        if (enemy.lifeSpan <= 0) enemy.lifeSpan = 0;
                    } else {
                        kills += 1;
                        playMusic();
                        setTimeout(() => {
                            enemies.splice(enemyIndex, 1);
                        }, 0);
                    }
                }
            });

            if (distanceBetween(player, enemy) <= canvas.height * 2 / 3) {
                setTimeout(() => {
                    enemy.velocity.x = (facingDirection === 'right') ? 1 : -1;
                    enemy.velocity.y = (Math.random() > 0.5) ? 1 : -1;
                }, 1000);

                if (enemy.weapon.isFire) {
                    const angle = Math.atan2(player.position.y + player.height / 2 - enemy.weapon.weaponPosition.y + enemy.weapon.height / 2,
                        player.position.x + player.height / 2 - enemy.weapon.weaponPosition.x - enemy.weapon.width / 2);

                    enemy.weapon.bullet.push(new Projectile(
                        enemy.weapon.weaponPosition.x,
                        enemy.weapon.weaponPosition.y,
                        5,
                        'red',
                        {
                            x: Math.cos(angle) * projectileSpeed,
                            y: Math.sin(angle) * projectileSpeed
                        }
                    ));
                    fire2.play();
                    setTimeout(() => enemy.weapon.isFire = false, 0);
                    setTimeout(() => enemy.weapon.isFire = true, 1000);
                }
            } else {
                var angle = calculateAngle(player, enemy);
                enemy.velocity.x = Math.cos(angle);
                enemy.velocity.y = Math.sin(angle);
            }

            if (enemy.weapon.bullet.length !== 0) {
                enemy.weapon.bullet.forEach((bullet, bulletIndex) => {
                    bullet.update();

                    //checking enemy bullet collision with player
                    if (isCollidedWith(player, bullet)) {
                        player.playerLifeSpan -= lifeReductionWhenHit;
                        if (player.playerLifeSpan <= 0) player.playerLifeSpan = 0;
                        setTimeout(() => enemy.weapon.bullet.splice(bulletIndex, 1), 0);

                        if (player.playerLifeSpan <= 0) {
                            dead.play();
                            player.playerLifeSpan = 0;
                            reset()
                        }
                    }

                    platforms.forEach(platform => {
                        if ((platform.position.x + platform.width > bullet.position.x) &&
                            (platform.position.x < bullet.position.x + bullet.width) &&
                            (platform.position.y + platform.height > bullet.position.y) &&
                            (platform.position.y < bullet.position.y + bullet.height)) {
                            setTimeout(() => enemy.weapon.bullet.splice(bulletIndex, 1), 0);
                        }
                    });

                    if (
                        (bullet.position.x + bullet.width < 0) ||
                        (bullet.position.x > canvas.width) ||
                        (bullet.position.y < 0) ||
                        (bullet.position.y - bullet.height > canvas.height - 150)
                        && enemy.weapon.isFire
                    ) {
                        setTimeout(() => enemy.weapon.bullet.splice(bulletIndex, 1), 0);
                    }
                })

            }
        })

        //drawing pointing scope
        pointingTarget(mousePosition.x, mousePosition.y);

        //indicator
        indicator();
    }

    //environment creation
    createEnvironment();

    //player creation
    player = playerCreation();

    listen();

    //spawning enemies
    spawnEnemies();

    //looping of game
    animate();
}

start();