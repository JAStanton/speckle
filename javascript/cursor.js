Game.Cursor = function() {
  this.position = new Game.Point(0, 0);
}

Game.Cursor.prototype.mouseMove = function(e) {
  var x = e.pageX;
  var y = e.pageY;
  // Memory Leak?
  this.position = new Game.Point(x, y);
};

Game.Cursor.prototype.getPosition = function() {
  return this.position;
}
