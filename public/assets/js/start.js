import { main } from './main.js';

export let name;


//start screen
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

        const nameInput = document.createElement('input');
        nameInput.style.border = 'none';
        nameInput.style.width = '565px';
        nameInput.style.height = '60px';
        nameInput.style.backgroundColor = '#032e28ed';
        nameInput.style.position = 'fixed';
        nameInput.style.top = '25%';
        nameInput.style.left = '35%';
        nameInput.style.fontSize = '40px';
        nameInput.style.textAlign = 'center';
        nameInput.setAttribute('placeholder', 'Enter Your name...');

        nameInput.addEventListener('change', (event) => {
            name = event.target.value;
        })

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
        body.appendChild(nameInput);
        body.appendChild(modeContainer);

        playmode.addEventListener('click', () => {
            body.removeChild(startBackgroundImage);
            body.removeChild(mask);
            body.removeChild(nameInput);
            body.removeChild(modeContainer);
            setTimeout(() => {
                startMusic.pause();
                main();
            }, 1000);

        })

        leaderBoardMode.addEventListener('click', () => {
            body.removeChild(modeContainer);
            body.removeChild(nameInput);
            startMusic.pause();
            showScoreBoard();
        })
    }, 1000);

    function showScoreBoard() {
        const scoreBoard = document.createElement('div');
        scoreBoard.style.position = 'fixed';
        scoreBoard.style.width = '30%';
        scoreBoard.style.height = '80vh';
        scoreBoard.style.backgroundColor = '#032e28ed';
        scoreBoard.style.color = 'gray';
        scoreBoard.style.borderRadius = '5px';

        const backBtn = document.createElement('div');
        backBtn.style.position = 'fixed';
        backBtn.style.top = '50px';
        backBtn.style.right = '35%';
        backBtn.style.fontSize = '20px';
        backBtn.style.borderBottom = '1px solid gray';
        backBtn.style.cursor = 'pointer';
        backBtn.innerHTML = 'Back To Start';
        scoreBoard.appendChild(backBtn);

        const container = document.createElement('div');
        container.style.padding = '20px 50px';
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.borderBottom = '4px solid black';

        const name = document.createElement('h1');
        name.innerHTML = 'Name';

        const kills = document.createElement('h1');
        kills.innerHTML = 'Kills';

        container.appendChild(name);
        container.appendChild(kills);
        scoreBoard.appendChild(container);

        async function getHighScore() {
            let data = await fetch('http://localhost:3000/api/scoreboard');
            let parsedData = await data.json();

            parsedData.forEach(element => {
                const container = document.createElement('div');
                container.style.padding = '20px 50px';
                container.style.display = 'flex';
                container.style.justifyContent = 'space-between';

                const name = document.createElement('h1');
                name.innerHTML = element.name;

                const kills = document.createElement('h1');
                kills.innerHTML = element.kills;

                container.appendChild(name);
                container.appendChild(kills);
                scoreBoard.appendChild(container);
            })
        }

        getHighScore();

        const body = document.querySelector('body');
        body.appendChild(scoreBoard);

        backBtn.addEventListener('click', () => {
            body.removeChild(scoreBoard);
            start();
        })
    }
}

