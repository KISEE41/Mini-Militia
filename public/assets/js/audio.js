const startMusic = new Audio('./assets/audio/MiniMilitia.mp3');

const gameStart = new Audio('./assets/audio/intro.mp3');
gameStart.loop = false;

const fire2 = new Audio('./assets/audio/PistolOld.mp3');
fire2.loop = false;

const fire1 = new Audio('./assets/audio/PistolNew.mp3');
fire1.loop = false;

const dead = new Audio('./assets/audio/Dead.mp3');
dead.loop = false;

duringPlayMusic = [];

duringPlayMusic.push(new Audio('./assets/audio/BI.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/CB.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/GG.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/GS.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/HH.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/LG.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/MO.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/NN.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/NS.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/RU.mp3'));
duringPlayMusic.push(new Audio('./assets/audio/WP.mp3'));

duringPlayMusic.forEach(music => {
    music.loop = false;
})

