import { SIZE, HEIGHT, WIDTH, MAP } from './constants.js';

const canvas = document.querySelector('canvas');
const CTX = canvas.getContext('2d');

const textScore = document.querySelector('.score');
const btn_up = document.querySelector('.btn_up');
const btn_left = document.querySelector('.btn_left');
const btn_down = document.querySelector('.btn_down');
const btn_right = document.querySelector('.btn_right');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
	constructor({ position, image }) {
		this.position = position;
		this.width = WIDTH;
		this.height = HEIGHT;
		this.image = image;
	}

	static width = WIDTH;
	static height = HEIGHT;

	draw() {
		//c.fillStyle = '#c500ff';
		//c.fillRect(this.position.x, this.position.y, this.width, this.height);

		CTX.drawImage(this.image, this.position.x, this.position.y);
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 13;
	}

	draw() {
		CTX.beginPath();
		CTX.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		CTX.fillStyle = 'yellow';
		CTX.fill();
		CTX.closePath();
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

const boundaries = [];
const player = new Player({
	position: {
		x: Boundary.width + Boundary.width / 2,
		y: Boundary.height + Boundary.height / 2,
	},
	velocity: {
		x: 0,
		y: 0,
	},
});

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	s: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	btn_up: {
		pressed: false,
	},
	btn_left: {
		pressed: false,
	},
	btn_down: {
		pressed: false,
	},
	btn_right: {
		pressed: false,
	},
};

let lastKey = '';

function createImages(src) {
	const image = new Image();
	image.src = src;
	return image;
}

function createWall(posX, posY, img) {
	return boundaries.push(
		new Boundary({
			position: {
				x: Boundary.width * posX,
				y: Boundary.height * posY,
			},

			image: createImages(img),
		}),
	);
}

const pathImgs = './src/images/';
MAP.forEach((row, posY) => {
	row.forEach((symbol, posX) => {
		switch (symbol) {
			case '-':
				createWall(posX, posY, pathImgs + 'pipeHorizontal.png');
				break;
			case '|':
				createWall(posX, posY, pathImgs + 'pipeVertical.png');
				break;
			case '1':
				createWall(posX, posY, pathImgs + 'block.png');
				break;
			case '2':
				createWall(posX, posY, pathImgs + 'pipeCorner2.png');
				break;
			case '3':
				createWall(posX, posY, pathImgs + 'pipeCorner3.png');
				break;
			case '4':
				createWall(posX, posY, pathImgs + 'pipeCorner4.png');
				break;
			case 'b':
				createWall(posX, posY, pathImgs + 'block.png');
				break;
			case '[':
				createWall(posX, posY, pathImgs + 'capLeft.png');
				break;
			case ']':
				createWall(posX, posY, pathImgs + 'capRight.png');
				break;
			case '_':
				createWall(posX, posY, pathImgs + 'capBottom.png');
				break;
			case '^':
				createWall(posX, posY, pathImgs + 'capTop.png');
				break;
			case '+':
				createWall(posX, posY, pathImgs + 'pipeCross.png');
				break;
			case '5':
				createWall(posX, posY, pathImgs + 'pipeConnectorTop.png');
				break;
			case '6':
				createWall(posX, posY, pathImgs + 'pipeConnectorRight.png');
				break;
			case '7':
				createWall(posX, posY, pathImgs + 'pipeConnectorBottom.png');
				break;
			case '8':
				createWall(posX, posY, pathImgs + 'pipeConnectorLeft.png');
				break;
		}
	});
});

function collides({ circle, rectangle }) {
	return (
		circle.position.y - circle.radius + circle.velocity.y <=
			rectangle.position.y + rectangle.height &&
		circle.position.x + circle.radius + circle.velocity.x >=
			rectangle.position.x &&
		circle.position.y + circle.radius + circle.velocity.y >=
			rectangle.position.y &&
		circle.position.x - circle.radius + circle.velocity.x <=
			rectangle.position.x + rectangle.width
	);
}

function animate() {
	requestAnimationFrame(animate);
	CTX.clearRect(0, 0, canvas.width, canvas.height);

	if (
		(keys.w.pressed && lastKey === 'w') ||
		(keys.btn_up.pressed && lastKey === 'btn_up')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: 0,
							y: -5,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.y = 0;
				break;
			} else {
				player.velocity.y = -5;
			}
		}
	} else if (
		(keys.a.pressed && lastKey === 'a') ||
		(keys.btn_left.pressed && lastKey === 'btn_left')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: -5,
							y: 0,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.x = 0;
				break;
			} else {
				player.velocity.x = -5;
			}
		}
	} else if (
		(keys.s.pressed && lastKey === 's') ||
		(keys.btn_down.pressed && lastKey === 'btn_down')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: 0,
							y: 5,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.y = 0;
				break;
			} else {
				player.velocity.y = 5;
			}
		}
	} else if (
		(keys.d.pressed && lastKey === 'd') ||
		(keys.btn_right.pressed && lastKey === 'btn_right')
	) {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				collides({
					circle: {
						...player,
						velocity: {
							x: 5,
							y: 0,
						},
					},
					rectangle: boundary,
				})
			) {
				player.velocity.x = 0;
				break;
			} else {
				player.velocity.x = 5;
			}
		}
	}

	boundaries.forEach((boundary) => {
		boundary.draw();

		if (
			collides({
				circle: player,
				rectangle: boundary,
			})
		) {
			player.velocity.y = 0;
			player.velocity.x = 0;
		}
	});

	player.update();
}

animate();

addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'w':
			keys.w.pressed = true;
			lastKey = 'w';
			break;
		case 'a':
			keys.a.pressed = true;
			lastKey = 'a';
			break;
		case 's':
			keys.s.pressed = true;
			lastKey = 's';
			break;
		case 'd':
			keys.d.pressed = true;
			lastKey = 'd';
			break;
	}
});

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'w':
			keys.w.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 's':
			keys.s.pressed = false;
			break;
		case 'd':
			keys.d.pressed = false;
			break;
	}
});

btn_up.addEventListener('click', () => {
	keys.btn_up.pressed = true;
	lastKey = 'btn_up';
});
btn_left.addEventListener('click', () => {
	keys.btn_left.pressed = true;
	lastKey = 'btn_left';
});
btn_down.addEventListener('click', () => {
	keys.btn_down.pressed = true;
	lastKey = 'btn_down';
});
btn_right.addEventListener('click', () => {
	keys.btn_right.pressed = true;
	lastKey = 'btn_right';
});
