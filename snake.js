const width = 20;
const height = 10;

let snake = [{ x: 10, y: 5 }];
let direction = { x: 1, y: 0 };
let apple = spawnApple();
let gameOver = false;

function spawnApple() {
  let newApple;
  do {
    newApple = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  } while (snake.some(s => s.x === newApple.x && s.y === newApple.y));
  return newApple;
}

function render() {
  let screen = "";
  if (gameOver) {
    // Draw top border
    screen += "+" + "-".repeat(width) + "+\n";
    // Calculate where to place the message
    const msg1 = " GAME OVER! ";
    const msg2 = "Press R to restart";
    const msg1Row = Math.floor(height / 2) - 1;
    const msg2Row = Math.floor(height / 2) + 1;
    for (let y = 0; y < height; y++) {
      screen += "|";
      if (y === msg1Row) {
        const pad = Math.floor((width - msg1.length) / 2);
        screen += " ".repeat(pad) + msg1 + " ".repeat(width - pad - msg1.length);
      } else if (y === msg2Row) {
        const pad = Math.floor((width - msg2.length) / 2);
        screen += " ".repeat(pad) + msg2 + " ".repeat(width - pad - msg2.length);
      } else {
        screen += " ".repeat(width);
      }
      screen += "|\n";
    }
    // Draw bottom border
    screen += "+" + "-".repeat(width) + "+";
  } else {
    screen += "+" + "-".repeat(width) + "+\n";
    for (let y = 0; y < height; y++) {
      screen += "|";
      for (let x = 0; x < width; x++) {
        if (snake[0].x === x && snake[0].y === y) {
          screen += "#";
        } else if (snake.slice(1).some(s => s.x === x && s.y === y)) {
          screen += "#";
        } else if (apple.x === x && apple.y === y) {
          screen += "@";
        } else {
          screen += " ";
        }
      }
      screen += "|\n";
    }
    screen += "+" + "-".repeat(width) + "+";
  }
  document.getElementById("game").textContent = screen;
}

function update() {
  if (gameOver) return;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    apple = spawnApple();
  } else {
    snake.pop();
  }
}

function resetGame() {
  snake = [{ x: 10, y: 5 }];
  direction = { x: 1, y: 0 };
  apple = spawnApple();
  gameOver = false;
}

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  const newDirection = {
    "arrowup": { x: 0, y: -1 },
    "w": { x: 0, y: -1 },
    "arrowdown": { x: 0, y: 1 },
    "s": { x: 0, y: 1 },
    "arrowleft": { x: -1, y: 0 },
    "a": { x: -1, y: 0 },
    "arrowright": { x: 1, y: 0 },
    "d": { x: 1, y: 0 }
  }[key];

  if (newDirection) {
    if (gameOver) resetGame();

    // Evita reversão de direção
    if (direction.x + newDirection.x !== 0 || direction.y + newDirection.y !== 0) {
      direction = newDirection;
    }
  } else if (key === "r") {
    resetGame();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".close-button");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.querySelector(".xp-window").style.display = "none";
    });
  }
});

setInterval(() => {
  update();
  render();
}, 200);
