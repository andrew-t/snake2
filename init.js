document.addEventListener('DOMContentLoaded', function() {
    var unit = 'vmin',
        arenaSize = 45,
        snakeWidth = 2,
        segmentLength = 3,
        arena = document.getElementById('arena'),
        snake = new Snake(segmentLength, new XY(arenaSize, arenaSize), snakeWidth, unit, arenaSize),
        pipLocation,
        pipSize = 4,
        score = 0,
        maxScore = 0,
        pipElement = document.getElementById('pip');
    snake.bind(arena);
    snake.onMove(function() {
        if (snake.distanceTo(pipLocation) < pipSize + snakeWidth / 2) {
            snake.grow(10);
            positionPip();
        }
        document.getElementById('score').innerHTML =
            score = snake.trueLength() - 1;
        if (score > maxScore)
            document.getElementById('max-score').innerHTML =
                maxScore = score;
    });
    snake.onAutocollide(function(collision) {
        snake.trim(Math.max(collision.point, collision.segment));
    });
    snake.grow(10);
    positionPip();

    pipElement.style.width = pipSize * 2 + unit;
    pipElement.style.height = pipSize * 2 + unit;
    arena.style.width = arenaSize * 2 + unit;
    arena.style.height = arenaSize * 2 + unit;

    arena.addEventListener('click', pause);
    arena.addEventListener('mouseleave', pause);
    document.getElementById('pause-overlay').addEventListener('click', function (e) {
        arena.classList.remove('paused');
        arena.classList.add('still-paused');
    });
    
    function pause() {
        snake.pause();
        arena.classList.add('paused');
    }
    function positionPip() {
        do pipLocation = new XY(Math.random() * arenaSize * 2, Math.random() * arenaSize * 2);
        while ((pipLocation.minus(new XY(arenaSize, arenaSize)).length() > arenaSize - pipSize) ||
            (snake.distanceTo(pipLocation) < pipSize * 3));
        pipElement.style.left = pipLocation.x - pipSize + unit;
        pipElement.style.top = pipLocation.y - pipSize + unit;        
    }
});