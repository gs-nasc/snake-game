(function () {
    const game = {
        snakeboard: document.getElementById('snakeGame'),
        snakeContext: document.getElementById('snakeGame').getContext('2d'),
        changingDirection: false,
        interval: null,
        score: 0,
        onLose: new Event('onLose'),
        init: () => {
            game.food.generate();
            game.event.init();
            game.start();
        },
        start: () => {
            game.interval = setInterval(() => {
                game.checkState();
                game.changingDirection = false;
                game.canvas.clear();
                game.snake.move();
                game.snake.draw();
                game.food.draw();
            }, 100);
        },
        restart: () => {
            game.snake.body = [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }, { x: 170, y: 200 }, { x: 160, y: 200 }];
            game.food.generate();
            game.interval = setInterval(() => {
                if (game.snake.collided()) clearInterval(game.interval);
                game.changingDirection = false;
                game.game();
                game.food.draw();
            }, 100);
        },
        lose: () => {
            clearInterval(game.interval);
        },
        checkState: () => {
            let lose = false;
            for (let i = 4; i < game.snake.body.length; i++) {
                const has_collided = game.snake.body[i].x === game.snake.body[0].x && game.snake.body[i].y === game.snake.body[0].y
                if (has_collided)
                    lose = true
            }
            const [hitLeftWall, hitRightWall, hitToptWall, hitBottomWall] = [game.snake.body[0].x < 0, game.snake.body[0].x > game.snakeboard.width - 10, game.snake.body[0].y < 0, game.snake.body[0].y > game.snakeboard.height - 10];

            lose = hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;

            if (lose) document.dispatchEvent(game.onLose);
        },
        event: {
            init: () => {
                document.getElementById("restart").addEventListener("click", game.restart);
                document.addEventListener("keydown", game.snake.changeDirection);
                document.addEventListener("onEat", game.snake.eat);
                document.addEventListener("onLose", game.lose);
            }
        },
        food: {
            x: 0,
            y: 0,
            onEat: new Event('onEat'),
            random: (min, max) => {
                return Math.round((Math.random() * (max - min) + min) / 10) * 10;
            },
            generate: () => {
                game.food.x = game.food.random(0, game.snakeboard.width - 10);
                game.food.y = game.food.random(0, game.snakeboard.height - 10);

                game.snake.body.forEach(function eaten(part) {
                    const hasEaten = part.x === game.food.x && part.y === game.food.y;
                    if (hasEaten) game.food.generate();
                });
            },
            draw: () => {
                game.snakeContext.fillStyle = 'red';
                game.snakeContext.stokestyle = 'black';
                game.snakeContext.fillRect(game.food.x, game.food.y, 10, 10);
                game.snakeContext.strokeRect(game.food.x, game.food.y, 10, 10);
            }
        },
        snake: {
            body: [{ x: 200, y: 200 }, { x: 190, y: 200 }, { x: 180, y: 200 }, { x: 170, y: 200 }, { x: 160, y: 200 }],
            dx: 10,
            dy: 0,
            drawPart: (part) => {
                game.snakeContext.fillStyle = 'green';
                game.snakeContext.stokestyle = 'black';
                game.snakeContext.fillRect(part.x, part.y, 10, 10);
                game.snakeContext.strokeRect(part.x, part.y, 10, 10);
            },
            eat: () => {
                game.food.generate();
                game.score++;
                document.getElementById("score").innerText = game.score;
            },
            draw: () => {
                game.snake.body.forEach(game.snake.drawPart);
            },
            move: () => {
                const x = game.snake.body[0].x + game.snake.dx;
                const y = game.snake.body[0].y + game.snake.dy;
                const head = { x, y };

                game.snake.body.unshift(head);

                const eaten = game.snake.body[0].x === game.food.x && game.snake.body[0].y === game.food.y;

                if (eaten) document.dispatchEvent(game.food.onEat);
                else game.snake.body.pop();
            },
            changeDirection: (event) => {
                const LEFT_KEY = 37;
                const RIGHT_KEY = 39;
                const UP_KEY = 38;
                const DOWN_KEY = 40;

                if (game.changingDirection) return;
                game.changingDirection = true;

                const keyPressed = event.keyCode;

                const goingUp = game.snake.dy === -10;
                const goingDown = game.snake.dy === 10;
                const goingRight = game.snake.dx === 10;
                const goingLeft = game.snake.dx === -10;

                switch (keyPressed) {
                    case LEFT_KEY:
                        if (!goingRight) [game.snake.dx, game.snake.dy] = [-10, 0];
                        break;

                    case UP_KEY:
                        if (!goingDown) [game.snake.dx, game.snake.dy] = [0, -10];
                        break;

                    case RIGHT_KEY:
                        if (!goingLeft) [game.snake.dx, game.snake.dy] = [10, 0];
                        break;

                    case DOWN_KEY:
                        if (!goingUp) [game.snake.dx, game.snake.dy] = [0, 10];
                        break;
                    default:
                        break;
                }
            }
        },
        canvas: {
            clear: () => {
                game.snakeContext.fillStyle = 'white';
                game.snakeContext.stokestyle = 'black';
                game.snakeContext.fillRect(0, 0, game.snakeboard.width, game.snakeboard.height);
                game.snakeContext.strokeRect(0, 0, game.snakeboard.width, game.snakeboard.height);
            }
        }
    }

    game.init();
})();
