import { enemiesSpawnInterval, spawnEnemies } from './enemies.js';
import { player, animateId, animate } from './main.js';

const statusIcon = createImage('./assets/images/status_icons.png');
const playPause = createImage('./assets/images/play-pause.png');
const weaponIndicator = createImage('./assets/images/pistol.png');
const head = createImage('./assets/images/head.png');

let pauseFlag = false;

export function indicator() {
    function lifeIndicator() {
        ctx.beginPath();
        ctx.moveTo(550, 30);
        ctx.lineTo(550, 110);
        ctx.lineTo(730, 110);
        ctx.lineTo(770, 70);
        ctx.lineTo(770, 30);
        ctx.lineTo(550, 30);
        ctx.fillStyle = 'rgba(120, 120, 120, 0.7)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        ctx.drawImage(statusIcon, 555, 43, 20, 55);
        ctx.drawImage(playPause, 738, 40, 23, 23);

        //life
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.moveTo(580, 43);
        ctx.lineTo(730, 43);
        ctx.lineTo(730, 61);
        ctx.lineTo(580, 61);
        ctx.lineTo(580, 43);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(580, 43, 100, 18);
        ctx.fillStyle = 'rgb(238, 130, 238)';
        ctx.fill();
        ctx.closePath();

        //booster
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.moveTo(580, 75);
        ctx.lineTo(730, 75);
        ctx.lineTo(730, 93);
        ctx.lineTo(580, 93);
        ctx.lineTo(580, 75);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(580, 75, player.booster, 18);
        ctx.fillStyle = 'rgb(0, 0, 255)';
        ctx.fill();
        ctx.closePath();
    }

    function weaponIndication() {
        ctx.beginPath();
        ctx.moveTo(1370, 30);
        ctx.lineTo(1370, 110);
        ctx.lineTo(1210, 110);
        ctx.lineTo(1160, 70);
        ctx.lineTo(1160, 30);
        ctx.lineTo(1370, 30);
        ctx.fillStyle = 'rgba(120, 120, 120, 0.7)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        ctx.drawImage(weaponIndicator, 1230, 30, 100, 65);

        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("003", 1215, 100);
        ctx.fillText("030", 1330, 100);
    }

    function lifeRemaining() {
        ctx.drawImage(head, 920, 40, 50, 50);
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = 'gray';
        ctx.fillText("x 3", 990, 78);
    }

    lifeIndicator();
    weaponIndication();
    lifeRemaining();
}

canvas.addEventListener('click', (event) => {
    if (event.clientX >= 730 && event.clientX <= 761 && event.clientY >= 30 && event.clientY <= 63) {
        pauseFlag = !pauseFlag;
        const texts = document.querySelectorAll('.playPause');

        texts.forEach(el => {
            el.remove();
        })

        var text = document.createElement("h1");
        text.setAttribute('class', 'playPause');
        document.querySelector('body').appendChild(text);
        text.style.fontSize = '40px';
        text.style.position = 'fixed';
        text.style.top = '50%';
        text.style.left = '50%';
        text.style.transform = 'translate(-50%, -50%)';
        text.style.transition = '2s ease';

        if (pauseFlag) {
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
            cancelAnimationFrame(animateId);
            clearInterval(enemiesSpawnInterval);
            text.style.color = 'red';
            text.innerHTML = 'PAUSED';
        } else {
            text.style.color = 'green';
            text.innerHTML = 'PLAY';
            setTimeout(() => {
                text.remove();
                requestAnimationFrame(animate);
                spawnEnemies();
            }, 500);
        }
    }
})