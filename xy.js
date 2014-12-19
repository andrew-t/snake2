function XY(x, y) {
    this.x = x;
    this.y = y;
}

XY.prototype.over = function(scalar) {
    return new XY(this.x / scalar, this.y / scalar);
};
XY.prototype.times = function(scalar) {
    return new XY(this.x * scalar, this.y * scalar);
};
XY.prototype.negate = function() {
    return new XY(-this.x, -this.y);
};

XY.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
XY.prototype.normalise = function() {
    return this.over(this.length());
};

XY.prototype.plus = function(point) {
    return new XY(this.x + point.x, this.y + point.y);
};
XY.prototype.minus = function(point) {
    return new XY(this.x - point.x, this.y - point.y);
};

XY.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
};

XY.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
};

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