const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const textScore = document.querySelector('.score');

const SIZE = 40;
const height = SIZE;
const width = SIZE;

const map = [
	['-', '-', '-', '-', '-', '-', '-'],
	['-', ' ', ' ', ' ', ' ', ' ', '-'],
	['-', ' ', '-', ' ', '-', ' ', '-'],
	['-', ' ', ' ', ' ', ' ', ' ', '-'],
	['-', '-', '-', '-', '-', '-', '-'],
];

function draw(x, y) {
	ctx.fillStyle = '#c500ff';
	ctx.fillRect(x * SIZE, y * SIZE, height, width);
}

canvas.height = innerHeight;
canvas.width = innerWidth;

map.forEach((arrRow, posY) => {
	arrRow.forEach((symbol, posX) => {
		symbol === '-' && draw(posX, posY);
	});
});
