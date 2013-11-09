Game.Board = function(board$) {
  this.el$_ = board$;
  this.body$ = $("body");
  this.centerOffsets = Game.helpers.calcCenterOffsetForDots();
  this.dots_ = [];
  this.lines_ = [];
  this.selectedDots_ = [];
  this.dotsByColumn_ = [];

  this.setupBoard_();
};

Game.Board.NUM_ROWS = 8;

Game.Board.NUM_COLS = 8;

Game.Board.prototype.redraw = function() {
  this.centerOffsets = Game.helpers.calcCenterOffsetForDots();
  for (var i = 0; i < this.dots_.length; i++) {
    var position = this.dots_[i].getGridPosition();
    this.dots_[i].setGridPosition(
        position.row, position.col, this.centerOffsets);
  };
};

Game.Board.prototype.setupBoard_ = function() {
  for (var col = 0; col < Game.Board.NUM_COLS; col++) {
    columnOfItems = [];
    for (var row = 0; row < Game.Board.NUM_ROWS; row++) {
      var dot = this.newDot(row, col, false);
      columnOfItems.push(dot);
    }
    this.dotsByColumn_.push(columnOfItems);
  };
};

/**
 * Dot Managment
 */
Game.Board.prototype.removedDot = function(dot) {
  var dotPosition = dot.getGridPosition();
  var dotsToAnimate = [];
  // I add these to an array essentially so I don't modify my dots array as I
  // itterate.
  this.forEachDotAboveDot(dot, function(dot){
    dotsToAnimate.push(dot);
  });

  for (var i = 0; i < dotsToAnimate.length; i++) {
    var dotsToAnimatePosition = dotsToAnimate[i].getNewGridPosition();
    var newRow = dotsToAnimatePosition.row + 1;
    dotsToAnimate[i].setNewGridPosition(
        new Game.Point(newRow, dotsToAnimatePosition.col))
    dotsToAnimate[i].animateNewGridPosition();
  };

  this.sliceDotOutOfColumn(dot);
  dot.remove();
  this.prependDot(0, dotPosition.col);
};

Game.Board.prototype.newDot = function(row, col) {
  var dot = new Game.Dot();
  dot.setGridPosition(row, col, this.centerOffsets);
  dot.appendTo(this.el$_);
  this.dots_.push(dot);
  dot.domReady();

  return dot;
};

Game.Board.prototype.prependDot = function(row, col) {
  var dot = new Game.Dot();
  dot.setGridPosition(row, col, this.centerOffsets);
  dot.appendTo(this.el$_);
  this.dots_.push(dot);
  this.dotsByColumn_[col].unshift(dot);
  dot.domReady();

  return dot;
};

Game.Board.prototype.getDotsByColor = function(colorClass) {
  var dots = [];

  this.forEachDot(function(dot){
    if (dot.getColor() == colorClass) {
      dots.push(dot);
    }
  });

  return dots;
};

Game.Board.prototype.numDotsInCol = function(col) {
  return this.dotsByColumn_[col].length;
};

// Dot Selection Management
Game.Board.prototype.forEachDotAboveDot = function(dot, fn) {
  var dotPosition = dot.getGridPosition();
  var dotsAbove = this.dotsByColumn_[dotPosition.col].slice(0, dotPosition.row);
  for (var i = 0; i < dotsAbove.length; i++) {
    fn(dotsAbove[i]);
  };
}

Game.Board.prototype.debugDots = function(dots) {
  for (var i = 0; i < dots.length; i++) {
    var position = dots[i].getGridPosition();
    console.log(position.row,position.col);
  };
}

Game.Board.prototype.forEachDot = function(fn) {
  for (var col = 0; col < this.dotsByColumn_.length; col++) {
    for (var row = 0; row < this.dotsByColumn_[col].length; row++) {
      fn(this.dotsByColumn_[col][row]);
    }
  }
};

Game.Board.prototype.selectDot = function(dot) {
  this.selectedDots_.push(dot);
  dot.select();
}

Game.Board.prototype.clearSelectedDots = function() {
  this.selectedDots_ = [];
}

Game.Board.prototype.deleteSelectedDots = function() {
  this.forEachSelectedDot(function(dot){
    this.sliceDotOutOfColumn(dot);
    dot.remove();
  }.bind(this));

  this.selectedDots_ = [];
}


Game.Board.prototype.sliceDotOutOfColumn = function(dot) {
  var dotPosition = dot.getGridPosition();
  var column = this.dotsByColumn_[dotPosition.col];
  for (var i = 0; i < column.length; i++) {
    if(column[i] == dot) {
      this.dotsByColumn_[dotPosition.col].splice(i, 1);
      break;
    }
  };
}

Game.Board.prototype.dotThatWillUnlink = function(dot) {
  return this.selectedDots_[this.selectedDots_.length - 2] === dot;
};

Game.Board.prototype.countSelectedDots = function() {
  return this.selectedDots_.length;
}

Game.Board.prototype.popSelectDots = function() {
  var poppedDot = this.selectedDots_.pop();
  return poppedDot;
}

Game.Board.prototype.isDotSelected = function(dotA) {
  var isSame = false;
  this.forEachSelectedDot(function(dotB){
    if(dotA === dotB){
      isSame = true;
      return true;
    }
  });
  return isSame;
}

Game.Board.prototype.forEachSelectedDot = function(fn) {
  for (var i = 0; i < this.selectedDots_.length; i++) {
    fn(this.selectedDots_[i]);
  };
}



/**
 * Line Management
 */

Game.Board.prototype.getCurrentLine = function() {
  return this.lines_[this.lines_.length - 1]
}

Game.Board.prototype.removeAllLines = function() {
  for (var i = 0; i < this.lines_.length; i++) {
    this.lines_[i].remove();
  };
  this.lines_ = [];
}

Game.Board.prototype.unlinkLastLine = function() {
  this.lines_.pop().remove();
}

Game.Board.prototype.connectLine = function(line, dot) {
  this.selectDot(dot);
  line.setTo(dot.getCenterPosition());
  line.setToDot(dot);
  this.newLine(dot);
};

Game.Board.prototype.newLine = function(dot) {
  var line = new Game.Line(dot.getCenterPosition(), dot.getColor());
  line.appendTo(this.body$);
  line.setFromDot(dot);
  this.lines_.push(line);
};
