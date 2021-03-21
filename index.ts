import { Game } from './enteties/Game';

const rngSource = <HTMLSelectElement>document.getElementById('url-server');
const gameRadius = <HTMLSelectElement>document.getElementById('layout-radius');

const game = new Game();
game.init(1);

rngSource.addEventListener('change', (e) => {
    const radius = Number(gameRadius.options[gameRadius.selectedIndex].value);
    const rngSourceLink = rngSource.options[rngSource.selectedIndex].value
    game.init(radius, rngSourceLink);
});

gameRadius.addEventListener('change', (e) => {
    const radius = Number(gameRadius.options[gameRadius.selectedIndex].value);
    const rngSourceLink = rngSource.options[rngSource.selectedIndex].value
    game.init(radius, rngSourceLink);
});



