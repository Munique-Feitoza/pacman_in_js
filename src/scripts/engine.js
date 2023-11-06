const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreNumber = document.querySelector('.scoreNumber');
const timeNumber = document.querySelector('.timeNumber');
const btn_up = document.getElementById('up');
const btn_left = document.getElementById('left');
const btn_down = document.getElementById('down');
const btn_right = document.getElementById('right');
const info = document.querySelector('.info');
const lose = document.querySelector('.lose');
const win = document.querySelector('.win');
const timer = document.querySelector('.timer');
const game = document.querySelector('.game');
const btnStart = document.querySelector('.btnStart');

let gameAudio;
let startTime = 0;
let intervalID = null;
let startMove = false;

function playAudio(music, volume) {
  const audio = new Audio(`./src/sounds/${music}.mp3`);
  audio.volume = volume;

  try {
    audio.play();
  } catch {

  }
  return audio;
}

function updateTime() {
  const elapsedTime = Date.now() - startTime;
  const secs = Math.floor((elapsedTime / 1000) % 60);
  const mins = Math.floor((elapsedTime / (1000 * 60)) % 60);

  const formattedSecs = secs.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');

  timeNumber.textContent = `${formattedMins}:${formattedSecs}`;
}

btnStart.addEventListener('click', () => {
  info.style.display = 'none';
  game.style.display = 'block';

  gameAudio = playAudio('soundGame', 0.5);
  startTime = Date.now();
  startMove = true;
  intervalID = setInterval(updateTime, 1000);
});

function youLose() {
  game.style.display = 'none';
  lose.style.display = 'block';
}

function youWin() {
  game.style.display = 'none';
  win.style.display = 'block';
  timer.innerHTML = timeNumber.textContent;
}

canvas.width = 420;
canvas.height = 720;

class Boundary {
  static width = 36;
  static height = 36;
  constructor({ position, image }) {
    this.position = position;
    this.width = 36;
    this.height = 36;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.openRate = 0.10;
    this.rotation = 0;
  }

  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
    c.lineTo(this.position.x, this.position.y, )
    c.fillStyle = '#ff0';
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.75) {
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }
}

class Ghost {
  static speed = 2;
  constructor({ position, velocity, color }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 2;
    this.scared = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.scared ? '#00f' : this.color;
    c.fill();
    c.closePath();
  }

  update() {
    if (startMove) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

class Fruit {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = '#fff';
    c.fill();
    c.closePath();
  }
}

class PowerUp {
  constructor({ position }) {
    this.position = position;
    this.radius = 8;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = '#fff';
    c.fill();
    c.closePath();
  }
}

const fruits = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height * 11 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: '#f00'
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 11 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: '#ffa500'
  })
];
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
  w:  false,
  a:  false,
  s:  false,
  d:  false,
  btn_up:  false,
  btn_left: false,
  btn_down: false,
  btn_right: false
}

let lastKey = '';

let score = 0;
const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];

function createImages(src) {
  const image = new Image();
  image.src = src;
  return image;
}

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/pipeHorizontal.png')
          })
        )
        break;
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/pipeVertical.png')
          })
        )
        break;
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/pipeCorner1.png')
          })
        )
        break;
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/pipeCorner2.png')
          })
        )
        break;
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/pipeCorner3.png')
          })
        )
        break;
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/pipeCorner4.png')
          })
        )
        break;
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImages('./src/images/block.png')
          })
        )
        break;
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImages('./src/images/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImages('./src/images/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImages('./src/images/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImages('./src/images/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImages('./src/images/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImages('./src/images/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImages('./src/images/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImages('./src/images/pipeConnectorBottom.png')
          })
        )
        break;
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImages('./src/images/pipeConnectorLeft.png')
          })
        )
        break;
      case '.':
        fruits.push(
          new Fruit({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break;
      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break;
    }
  })
})

function collides({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1

  return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding);
}

let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  if ((keys.w && lastKey === 'w') || (keys.btn_up && lastKey === 'btn_up')) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collides({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: -4
            }
          },
          rectangle: boundary
        })) {

        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -4;
      }
    }
  } else if ((keys.a && lastKey === 'a') || (keys.btn_left && lastKey === 'btn_left')) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collides({
          circle: {
            ...player,
            velocity: {
              x: -4,
              y: 0
            }
          },
          rectangle: boundary
        })) {

        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -4;
      }
    }
  } else if ((keys.s && lastKey === 's') || (keys.btn_down && lastKey === 'btn_down')) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collides({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 4
            }
          },
          rectangle: boundary
        })) {

        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 4;
      }
    }
  } else if ((keys.d && lastKey === 'd') || (keys.btn_right && lastKey === 'btn_right')) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collides({
          circle: {
            ...player,
            velocity: {
              x: 4,
              y: 0
            }
          },
          rectangle: boundary
        })) {

        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 4;
      }
    }
  }
  for (let i = ghosts.length - 1; i >= 0; i--) {
    const ghost = ghosts[i];
    if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius && !ghost.scared) {

      cancelAnimationFrame(animationId);
      clearInterval(intervalID);

      if (gameAudio) {
        gameAudio.pause();
      }
      let loseAudio = playAudio('soundLose', 0.5);
      setTimeout(() => { youLose() }, 2000);
    }
  }

  if (fruits.length === 0 && powerUps.length === 0) {
    cancelAnimationFrame(animationId);
    clearInterval(intervalID);

    if (gameAudio) {
      gameAudio.pause();
    }
    let winAudio = playAudio('soundWin', 1);
    setTimeout(() => { youWin() }, 2000);
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();

    if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
      powerUps.splice(i, 1);

      ghosts.forEach(ghost => {
        ghost.scared = true;

        setTimeout(() => {
          ghost.scared = false;
        }, 5000);
      })
    }
  }

  for (let i = fruits.length - 1; i >= 0; i--) {
    const fruit = fruits[i];
    fruit.draw();

    if (Math.hypot(fruit.position.x - player.position.x, fruit.position.y - player.position.y) < fruit.radius + player.radius) {
      fruits.splice(i, 1);
      score += 10;
      scoreNumber.innerHTML = score;
    }
  }

  boundaries.forEach(boundary => {
    boundary.draw();

    if (collides({
        circle: player,
        rectangle: boundary
      })) {
      player.velocity.y = 0;
      player.velocity.x = 0;
    }
  });

  player.update();
  ghosts.forEach(ghost => {
    ghost.update();

    const collisions = [];
    boundaries.forEach(boundary => {

      if (!collisions.includes('right') && collides({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })) {
        collisions.push('right');
      }
      if (!collisions.includes('left') && collides({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })) {
        collisions.push('left');
      }
      if (!collisions.includes('up') && collides({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed
            }
          },
          rectangle: boundary
        })) {
        collisions.push('up');
      }
      if (!collisions.includes('down') && collides({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed
            }
          },
          rectangle: boundary
        })) {
        collisions.push('down');
      }
    })
    if (collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions;


    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

      const pathways = ghost.prevCollisions.filter(collision => {
        return !collisions.includes(collision);
      })

      const direction = pathways[Math.floor(Math.random() * pathways.length)];

      switch (direction) {
        case 'down':
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break;
        case 'up':
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break;
        case 'right':
          ghost.velocity.y = 0;
          ghost.velocity.x = ghost.speed;
          break;
        case 'left':
          ghost.velocity.y = 0;
          ghost.velocity.x = -ghost.speed;
          break;
      }

      ghost.prevCollisions = [];
    }
  })

  if (player.velocity.x > 0) {
    player.rotation = 0;
  } else if (player.velocity.x < 0) {
    player.rotation = Math.PI;
  } else if (player.velocity.y < 0) {
    player.rotation = Math.PI * 1.5;
  } else if (player.velocity.y > 0) {
    player.rotation = Math.PI / 2;
  }
}

setInterval(animate(), 1000 / 60);

addEventListener('keydown', ({ key }) => {
  keys[key] = true;
  lastKey = key; 
})

addEventListener('keyup', ({ key }) => {
  keys[key] = false;
})

btn_up.addEventListener('click', () => {
  keys.btn_up = true;
  lastKey = 'btn_up';
})

btn_left.addEventListener('click', () => {
  keys.btn_left = true;
  lastKey = 'btn_left';
})

btn_down.addEventListener('click', () => {
  keys.btn_down = true;
  lastKey = 'btn_down';
})

btn_right.addEventListener('click', () => {
  keys.btn_right = true;
  lastKey = 'btn_right';
})