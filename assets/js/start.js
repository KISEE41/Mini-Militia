import { main } from './main.js';

export function start() {
    const body = document.querySelector('body');
    const startBackgroundImage = document.createElement('div');

    startBackgroundImage.style.position = 'fixed';
    startBackgroundImage.style.top = 0;
    startBackgroundImage.style.left = 0;
    startBackgroundImage.style.width = '100%';
    startBackgroundImage.style.height = '100vh';

    startBackgroundImage.style.backgroundImage = 'url(./assets/images/mn.jpg)';
    startBackgroundImage.style.backgroundRepeat = 'no-repeat';
    startBackgroundImage.style.backgroundPosition = '0 0';
    startBackgroundImage.style.backgroundSize = '100% 100%';

    body.appendChild(startBackgroundImage);
    startMusic.play();

    setTimeout(() => {
        const survivalImgae = createImage('./assets/images/soldier-army-military.png');
        const leaderboardImage = createImage('./assets/images/Leaderboard.png');

        const mask = document.createElement('div');
        mask.style.position = 'fixed';
        mask.style.top = 0;
        mask.style.left = 0;
        mask.style.width = '100%';
        mask.style.height = '100vh';
        mask.zIndex = 3;
        mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        const modeContainer = document.createElement('div');
        const playmode = document.createElement('div');
        const leaderBoardMode = document.createElement('div');
        modeContainer.style.position = 'fixed';
        modeContainer.style.display = 'flex'

        modeContainer.appendChild(playmode);
        modeContainer.appendChild(leaderBoardMode);

        const survivalText = document.createElement('h1');
        const LeaderBoardText = document.createElement('h1');

        survivalText.style.marginTop = '20px';
        LeaderBoardText.style.marginTop = '20px';

        survivalText.innerHTML = 'SURVIVAL';
        LeaderBoardText.innerHTML = 'LEADERBOARD';

        playmode.style.height = '240px';
        playmode.style.width = '200px';
        playmode.style.background = '#032e28ed';
        playmode.style.borderRadius = '10px';
        playmode.style.margin = '30px';
        playmode.appendChild(survivalImgae);
        playmode.style.padding = '20px';
        survivalImgae.style.width = "100%"
        playmode.style.textAlign = 'center';
        playmode.style.color = 'green';
        playmode.style.cursor = 'pointer';
        playmode.appendChild(survivalText);

        playmode.addEventListener('mouseover', () => {
            playmode.style.color = 'white';
        })

        playmode.addEventListener('mouseout', () => {
            playmode.style.color = 'green';
        })

        leaderBoardMode.style.height = '240px';
        leaderBoardMode.style.width = '200px';
        leaderBoardMode.style.background = '#032e28ed';
        leaderBoardMode.style.borderRadius = '10px';
        leaderBoardMode.style.margin = '30px';
        leaderBoardMode.appendChild(leaderboardImage);
        leaderBoardMode.style.padding = '20px';
        leaderboardImage.style.width = "100%"
        leaderBoardMode.style.color = 'green';
        leaderBoardMode.style.textAlign = 'center';
        leaderBoardMode.style.cursor = 'pointer';
        leaderBoardMode.appendChild(LeaderBoardText);

        leaderBoardMode.addEventListener('mouseover', () => {
            leaderBoardMode.style.color = 'white';
        })

        leaderBoardMode.addEventListener('mouseout', () => {
            leaderBoardMode.style.color = 'green';
        })

        body.appendChild(mask);
        body.appendChild(modeContainer);

        playmode.addEventListener('click', () => {
            body.removeChild(startBackgroundImage);
            body.removeChild(mask);
            body.removeChild(modeContainer);
            setTimeout(() => {
                startMusic.pause();
                main();
            }, 1000);

        })

        leaderBoardMode.addEventListener('click', () => {
            // body.removeChild(startBackgroundImage);
            // body.removeChild(mask);
            // body.removeChild(modeContainer);
            startMusic.pause();
            alert("Under Construction, please wait...");
        })
    }, 3000);
}

