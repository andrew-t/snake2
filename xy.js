function XY(x, y) {
    this.x = x;
    this.y = y;
}

// Scalar functions:
XY.prototype.over = function(scalar) {
    return new XY(this.x / scalar, this.y / scalar);
};
XY.prototype.times = function(scalar) {
    return new XY(this.x * scalar, this.y * scalar);
};
XY.prototype.negate = function() {
    return new XY(-this.x, -this.y);
};

// Multi-scalar functions:
XY.prototype.overElementwise = function(scalar) {
    return new XY(this.x / scalar.x, this.y / scalar.y);
};
XY.prototype.timesElementwise = function(scalar) {
    return new XY(this.x * scalar.x, this.y * scalar.y);
};

// Magnitude functions:
XY.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
XY.prototype.normalise = function() {
    return this.over(this.length());
};

// Vector functions:
XY.prototype.plus = function(point) {
    return new XY(this.x + point.x, this.y + point.y);
};
XY.prototype.minus = function(point) {
    return new XY(this.x - point.x, this.y - point.y);
};
XY.prototype.dot = function(point) {
    return this.x * point.x + this.y * point.y;
};

// Trigonometry functions:
XY.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
};

// Equality functions:
XY.prototype.equals = function(point) {
    return (this.x == point.x) && (this.y == point.y);
};

// OO functions:
XY.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
};

// Miscellaneous geometric functions:
XY.prototype.nearestPointOnSegment = function(a, b) {
    // http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    if (a.equals(b)) return a;
    var direction = b.minus(a),
        t = this.minus(a).dot(direction) / direction.length();
    if (t < 0) return a;
    if (t > 1) return b;
    return a.plus(direction.times(t));
};
XY.prototype.distanceToSegment = function(a, b) {
    return this.minus(this.nearestPointOnSegment(a, b)).length();
};

// DOM functions:
XY.event = function(event) {
    return new XY(event.pageX, event.pageY);
};
XY.element = function(element) {
    var point = new XY(0, 0);
    while (element) {
        point = point.plus(new XY(element.offsetLeft, element.offsetTop));
        element = element.offsetParent;
    }
    return point;
};