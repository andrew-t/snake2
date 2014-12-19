document.addEventListener('DOMContentLoaded', function() {
    var unit = 'px',
        arenaSize = 250,
        snakeWidth = 10,
        arena = document.getElementById('arena'),
        snake = new Snake(15, new XY(arenaSize, arenaSize), 200, snakeWidth, unit, arenaSize),
        pipLocation,
        pipSize = 20,
        score = 0,
        maxScore = 0,
        pipElement = document.getElementById('pip');
    snake.bind(arena);
    snake.onMove(function() {
        if (snake.distanceTo(pipLocation) < pipSize + snakeWidth / 2) {
            snake.grow(10);
            positionPip();
        }
        document.getElementById('score').innerText = score = snake.trueLength();
        if (score > maxScore)
            document.getElementById('max-score').innerText = maxScore = score;
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
      
    function positionPip() {
        do pipLocation = new XY(Math.random() * arenaSize * 2, Math.random() * arenaSize * 2);
        while ((pipLocation.minus(new XY(arenaSize, arenaSize)).length() > arenaSize - pipSize) ||
            (snake.distanceTo(pipLocation) < pipSize * 3));
        pipElement.style.left = pipLocation.x - pipSize + unit;
        pipElement.style.top = pipLocation.y - pipSize + unit;        
    }
});