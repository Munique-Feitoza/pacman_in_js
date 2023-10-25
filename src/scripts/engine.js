const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const textScore = document.querySelector('.score');
const btn_up = document.querySelector('.btn_up');
const btn_left = document.querySelector('.btn_left');
const btn_down = document.querySelector('.btn_down');
const btn_right = document.querySelector('.btn_right');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
  static width = 40;
  static height = 40;
	constructor({ position }) {
		this.position = position;
		this.width = 40;
		this.height = 40;
	}

	draw() {
		c.fillStyle = '#c500ff';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

class Player {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }
  
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'yellow';
    c.fill();
    c.closePath();
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
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
});

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  btn_up: {
    pressed: false
  },
  btn_left: {
    pressed: false
  },
  btn_down: {
    pressed: false
  },
  btn_right: {
    pressed: false
  }
}

let lastKey = '';

const map = [
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-', '-']
  ]


map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            }
          })
        )
        break;
    }
  })
})


function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height)
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  
  player.update();

  player.velocity.y = 0;
  player.velocity.x = 0;
  
  if((keys.w.pressed && lastKey === 'w') || (keys.btn_up.pressed && lastKey === 'btn_up')) {
    player.velocity.y = -5;
  } else if((keys.a.pressed  && lastKey === 'a') || (keys.btn_left.pressed && lastKey === 'btn_left')) {
    player.velocity.x = -5;
  } else if((keys.s.pressed  && lastKey === 's') || (keys.btn_down.pressed && lastKey === 'btn_down')) {
    player.velocity.y = 5;
  } else if((keys.d.pressed  && lastKey === 'd') || (keys.btn_right.pressed && lastKey === 'btn_right')) {
    player.velocity.x = 5;
  } 
  
  btn_up.addEventListener('click', () => {
    keys.btn_up.pressed = true;
    lastKey = 'btn_up';
  })
  btn_left.addEventListener('click', () => {
    keys.btn_left.pressed = true;
    lastKey = 'btn_left';
  })
  btn_down.addEventListener('click', () => {
    keys.btn_down.pressed = true;
    lastKey = 'btn_down';
  })
  btn_right.addEventListener('click', () => {
    keys.btn_right.pressed = true;
    lastKey = 'btn_right';
  })
}

animate();

addEventListener('keydown', ({key}) => {
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
})

addEventListener('keyup', ({key}) => {
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
})

  
