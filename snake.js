function Snake(segmentLength, head, interval, width, unit) {
    var coords = [ head ],
        self = this,
        length = 1,
        moveCallbacks = [],
        autocollisionCallbacks = [];

    this.onMove = function(callback) {
        moveCallbacks.push(callback);
    };
    this.autoCollide = function(callback) {
        autocollisionCallbacks.push(callback);
    };

    this.distanceTo = function(point) {
        var d = Infinity;
        forCoords(function(current, last) {
            var currentD = point.distanceToSegment(current, last);
            if (currentD < d) d = currentD;
        });
        return d;
    };

    this.bind = function(arena) {
        var started = false,
            elements = [];

        arena.addEventListener('mousemove', function(event) {
            var mouse = XY.event(event).minus(XY.element(arena));
            if (started) {
                if (coords.length < length) {
                    if (mouse.minus(coords[0]).length() >= segmentLength)
                        coords.unshift(
                            coords[0].plus(mouse.minus(coords[0])
                                                .normalise()
                                                .times(segmentLength)));
                } else {
                    coords[0] = mouse;
                    pull();
                }
            } else if (mouse.minus(coords[0]).length() < segmentLength)
                started = true;

            draw();
            moveCallbacks.forEach(function(callback) { callback(); });
        });

        self.bind = function() { return false; };
        return true;

        function pull() {
            forCoords(function(current, last, i) {
                coords[i] = last.plus(current.minus(last)
                                             .normalise()
                                             .times(segmentLength));
            });
        }

        function draw() {
            var dx = (segmentLength + width) / 2,
                dy = width / 2;
            forCoords(function(current, last, i) {
                var element = elements[i],
                    centre = last.plus(current).over(2);
                if (!element) {
                    element = elements[i] = document.createElement('div');
                    element.classList.add('snake-segment');
                    element.style.height = width + unit;
                    element.style.width = segmentLength + width + unit;
                    arena.appendChild(element);
                }
                element.style.top = centre.y - dy + unit;
                element.style.left = centre.x - dx + unit;
                element.style.transform = element.style.webkitTransform =
                    'rotate(' + current.minus(last).angle() + 'rad)';
            });
        }
    };

    this.grow = function(extra) {
        length += extra;
    };

    function forCoords(callback) {
        for (var i = 1; i < coords.length; ++i)
            callback(coords[i], coords[i - 1], i);
    };
}