Game.helpers = {};
Game.helpers.randomBetween = function(from, to) {
  return Math.floor(Math.random() * to) + from
};

Game.helpers.distance = function(p1, p2){
  var xs = 0;
  var ys = 0;

  xs = p2.x - p1.x;
  xs = xs * xs;

  ys = p2.y - p1.y;
  ys = ys * ys;

  return Math.round(Math.sqrt( xs + ys ), 2);
};

Game.helpers.angle = function(p1, p2) {
  return Math.round(
      Math.atan2(p2.x - p1.x, p2.y - p1.y) * 180 / Math.PI, 2);
}

Game.helpers.calcCenterOffsetForDots = function(resized) {
  if(this.memoized && !resized) {
    return this.memoized;
  }

  var headerHeight = $("body > header").outerHeight();
  var bodyWidth = $("body").width();
  var bodyHeight = $("body").height();
  var boardWidth = (Game.Board.NUM_COLS * Game.Dot.WIDTH) + (Game.Board.NUM_COLS * Game.Dot.PADDING)
  var boardHeight = (Game.Board.NUM_ROWS * Game.Dot.HEIGHT) + (Game.Board.NUM_ROWS * Game.Dot.PADDING)

  // An offset shouldn't be negative. Math.max(x, 0)
  var offsetTop = Math.max((bodyHeight / 2) - (boardHeight / 2), 0) +
    (Game.Dot.PADDING / 2) + headerHeight;
  var offsetLeft = Math.max((bodyWidth / 2) - (boardWidth / 2), 0) +
    (Game.Dot.PADDING / 2);

  this.memoized = {offsetTop: offsetTop, offsetLeft: offsetLeft};
  return this.memoized;
}
