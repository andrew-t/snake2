function Snake(segmentLength, head, width, unit, arenaSize) {
    var coords = [ head ],
        self = this,
        length = 1,
        moveCallbacks = [],
        autocollisionCallbacks = [],
        elements = [];

    this.onMove = function(callback) {
        moveCallbacks.push(callback);
    };
    this.onAutocollide = function(callback) {
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
            mouseMultiplier;

        arena.classList.remove('started');

        var padCoords = coords[0];
        everyFrame(function (time) {
            var pad = navigator.getGamepads()[0];
            if (!pad) return;

            var stick = new XY(getAxis(pad, 0), getAxis(pad, 1));

            padCoords = padCoords.plus(stick.times(time * padSpeed));

            if (padCoords.minus(head).length() > arenaSize)
                padCoords = padCoords
                    .minus(head)
                    .normalise()
                    .times(arenaSize)
                    .plus(head);

            moveTo(padCoords);
        }, 100);

        arena.addEventListener('mousemove', function(event) {
            var mouse = XY.event(event).minus(XY.element(arena)).times(mouseMultiplier);
            if (mouse.minus(new XY(arenaSize, arenaSize)).length() > arenaSize - width) return;

            moveTo(mouse);
        });

        function moveTo(mouse) {
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
            } else if (mouse.minus(coords[0]).length() < segmentLength) {
                arena.classList.remove('still-paused');
                arena.classList.add('started');
                started = true;
            }

            draw();
            moveCallbacks.forEach(function(callback) { callback(); });

            var collision = false;
            coords.forEach(function(point, i) {
                if (!collision) forCoords(function(current, last, j) {
                    if (i == j || i + 1 == j) return;
                    if (point.distanceToSegment(current, last) < width)
                        collision = {
                            point: i,
                            segment: j
                        };
                });
            });
            if (collision)
                autocollisionCallbacks.forEach(function(callback) {
                    callback(collision);
                });
        }

        self.bind = function() { throw 'Already bound.'; };
        self.recalibrate = function () {
            // We assume no crazy box model stuff here.
            mouseMultiplier = arenaSize * 2 / arena.clientWidth;
        };
        self.pause = function () {
            started = false;
        }

        self.recalibrate();
        window.addEventListener('resize', self.recalibrate);

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
        return length += extra;
    };

    this.trim = function(maxLength) {
        if (maxLength < length) {
            length = maxLength;
            if (coords.length > length)
                coords.length = length;
            while (elements.length > length) (function(element) {
                element.style.opacity = 0;
                setTimeout(function() {
                    arena.removeChild(element);
                }, 600);
            })(elements.pop());
        }
        return length;
    };

    this.trueLength = function() {
        return coords.length;
    }

    function forCoords(callback) {
        for (var i = 1; i < coords.length; ++i)
            callback(coords[i], coords[i - 1], i);
    };
}

Snake.prototype.pause = 
Snake.prototype.recalibrate = function() {
    throw 'Not yet bound.';
};

var deadzone = 0.08,
    padSpeed = 0.05;
function getAxis(pad, n) {
    return (Math.abs(pad.axes[n]) < deadzone) ? 0 : pad.axes[n];
}