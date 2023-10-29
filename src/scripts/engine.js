const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreNumber = document.querySelector('.scoreNumber');
const timeNumber = document.querySelector('.timeNumber');
const btn_up = document.querySelector('.btn_up');
const btn_left = document.querySelector('.btn_left');
const btn_down = document.querySelector('.btn_down');
const btn_right = document.querySelector('.btn_right');
const info = document.querySelector('.info');
const lose = document.querySelector('.lose');
const win = document.querySelector('.win');
const game = document.querySelector('.game');
const btnStart = document.querySelector('.btnStart');

let startTime = 0;
let intervalID = null;
let startMove = false;

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
}

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
  static width = 36;
  static height = 36;
	constructor({position, image}) {
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

class Ghost {
  static speed = 2;
  constructor({position, velocity, color}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 2;
  }
  
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  
  update() {
    if(startMove){
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}


class Fruit {
  constructor({position}) {
    this.position = position;
    this.radius = 3;
  }
  
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'white';
    c.fill();
    c.closePath();
  }
}

const fruits = [];
const boundaries = [];
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
      x: Boundary.width * 5 + Boundary.width / 2,
      y: Boundary.height * 11 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: '#0ff'
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

let score = 0;
const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
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
        break
    }
  })
})

function collides({circle, rectangle}) {
  const padding = Boundary.width / 2 - circle.radius - 1
  
  return(circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding);
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  
  if((keys.w.pressed && lastKey === 'w') || (keys.btn_up.pressed && lastKey === 'btn_up')) {
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if(collides({
        circle: {...player, velocity: {
          x: 0,
          y: -4
        }},
        rectangle: boundary
      })) {
        
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -4;
      }
    }
  } else if((keys.a.pressed  && lastKey === 'a') || (keys.btn_left.pressed && lastKey === 'btn_left')) {
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if(collides({
        circle: {...player, velocity: {
          x: -4,
          y: 0
        }},
        rectangle: boundary
      })) {
        
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -4;
      }
    }
  } else if((keys.s.pressed  && lastKey === 's') || (keys.btn_down.pressed && lastKey === 'btn_down')) {
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if(collides({
        circle: {...player, velocity: {
          x: 0,
          y: 4
        }},
        rectangle: boundary
      })) {
        
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 4;
      }
    }
  } else if((keys.d.pressed  && lastKey === 'd') || (keys.btn_right.pressed && lastKey === 'btn_right')) {
    for(let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if(collides({
        circle: {...player, velocity: {
          x: 4,
          y: 0
        }},
        rectangle: boundary
      })) {
        
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 4;
      }
    }
  } 
  
  
  for(let i = fruits.length - 1; 0 < i; i--) {
    const fruit = fruits[i];
    fruit.draw();
    
    if(Math.hypot(fruit.position.x - player.position.x, fruit.position.y - player.position.y) < fruit.radius + player.radius) {
      fruits.splice(i, 1);
      score += 10;
      scoreNumber.innerHTML = score;
    }
  }
    
  boundaries.forEach(boundary => {
    boundary.draw();
    
    if(collides({
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
    
    if(Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius) {
      cancelAnimationFrame(animationId);
      setTimeout(youLose(), 7000);
    }
    
    const collisions = [];
    boundaries.forEach(boundary => {
      
      if(!collisions.includes('right') && collides({
        circle: {...ghost, velocity: {
          x: ghost.speed,
          y: 0
        }},
        rectangle: boundary
      })
      ) {
        collisions.push('right');
      }
      if(!collisions.includes('left') &&  collides({
        circle: {...ghost, velocity: {
          x: -ghost.speed,
          y: 0
        }},
        rectangle: boundary
      })
      ) {
        collisions.push('left');
      }
      if(!collisions.includes('up') &&  collides({
        circle: {...ghost, velocity: {
          x: 0,
          y: -ghost.speed
        }},
        rectangle: boundary
      })
      ) {
        collisions.push('up');
      }
      if(!collisions.includes('down') &&  collides({
        circle: {...ghost, velocity: {
          x: 0,
          y: ghost.speed
        }},
        rectangle: boundary
      })
      ) {
        collisions.push('down');
      }
    })
    if(collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions;
    
    
    if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      
      if(ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if(ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if(ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      else if(ghost.velocity.y > 0) ghost.prevCollisions.push('down')
      
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
  }
  )
}

setInterval(animate(), 1000/60);

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
