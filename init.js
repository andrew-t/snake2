document.addEventListener('DOMContentLoaded', function() {
    var snake = new Snake(15, new XY(250, 250), 200, 10, 'px');
    snake.bind(document.getElementById('arena'));
    snake.grow(100);
});