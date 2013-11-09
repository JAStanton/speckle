var Game = function(board$) {
  window["a"] = this;
  this.board = new Game.Board(board$);

  this.cursor_ = new Game.Cursor();
  this.header_;
  this.setupHeader_();
  this.body$ = $("body");
  this.state_ = Game.CURSOR_STATES.none;
  this.lines_ = [];
  this.bindEvents_();
  this.superMode = false;
  this.superDot = {};

  this.score_ = 0;
  this.moves_ = Game.INITIAL_MOVES;
  this.time_ = Game.INITIAL_TIME;
};

Game.CURSOR_STATES = {
  "none": 0,
  "dragging": 1,
};

Game.prototype.setupHeader_ = function() {
  this.header_ = new Game.Header(Game.Header.MODES.moves);
}

Game.prototype.bindEvents_ = function() {
  this.body$.on("mousemove", this.mouseMove_.bind(this));
  this.body$.on("mouseup", this.mouseUp_.bind(this));
  this.body$.on("mouseleave", this.mouseUp_.bind(this));
  this.body$.on("mouseover", ".dot", this.mouseOverDot_.bind(this));
  this.body$.on("mousedown", ".dot", this.mouseDownDot_.bind(this));
  $(window).on("resize", this.resize_.bind(this));
};

Game.prototype.resize_ = function(){
  this.board.redraw();
};

Game.prototype.mouseMove_ = function(e){
  if(this.state_ != Game.CURSOR_STATES.dragging) {
    return;
  }

  this.cursor_.mouseMove(e);
  var currentLine$ = this.lines_[this.lines_.length - 1];
  currentLine$.setTo(this.cursor_.getPosition());
};

Game.prototype.mouseUp_ = function(e){
  this.setCursorState(Game.CURSOR_STATES.none);

  // Remove the lines
  for (var i = 0; i < this.lines_.length; i++) {
    this.lines_[i].remove();
  };
  this.lines_ = [];

  // Bail early if we've only selected one
  if(this.board.countSelectedDots() <= 1){
    this.board.clearSelectedDots();
    return;
  }

  if(this.superMode) {
    var superDotColor = this.superDot.getColor();
    // Destroy all dots of this color. I know, racist.
    this.board.forEachDot(function(potentialDot){
      if (potentialDot.getColor() == superDotColor) {
        potentialDot.remove();
      }
    }.bind(this));
    this.superMode = false;
  }

  this.replenishDots();
};

Game.prototype.mouseDownDot_ = function(e){
  if(e.which != 1) return; // only left click
  this.setCursorState(Game.CURSOR_STATES.dragging);

  var $clicked = $(e.target);
  var dot = $clicked.data("dot");

  // TODO(jstanton): combine these actions.
  //     (requires maintaining lines in board).
  this.board.selectDot(dot);
  this.newLine(dot);
};

Game.prototype.mouseOverDot_ = function(e){
  if(this.state_ != Game.CURSOR_STATES.dragging) {
    return;
  }

  var $over = $(e.target);
  var dot = $over.data("dot");
  var $currentLine = this.lines_[this.lines_.length - 1];
  var lineFromDot = $currentLine.getFromDot();
  var numSelected = this.board.countSelectedDots();
  if (!Game.Dot.validateMove(lineFromDot, dot)) {
    // not a valid move. So bail.
    return;
  } // All moves here on out are atleast potentially valid!

  // Determine if I should link, not link, unlink, go into super mode, or come
  // out of super mode.
  if(!this.board.isDotSelected(dot)) {
    // I haven't seen this dot yet! Link it!
    this.connectLine($currentLine, dot);
  } else if(numSelected > 1 && this.board.dotThatWillUnlink(dot)) {
    // Ok so I know i've seen the dot before, and as it turns out, this is the
    // dot that will cause me to unlink my chain!
    this.lines_.pop().remove();
    var removedDot = this.board.popSelectDots();
    if(this.superDot == removedDot){
      // I just removed the superDot, therefore superMode is off.
      this.superMode = false;
    }
  } else if(!this.superMode) {
    // Ok so I know I've seen the dot before, and it's not the dot that will
    // cause me to unlink my chain. That means I should either go into super
    // mode OR if I'm already in super mode I should bail!

    // go into SUPER MODE! and keep track of the dot that put me here so I can
    // back out easily.
    this.superMode = true;
    this.superDot = dot;
    this.connectLine($currentLine, dot);

    this.board.forEachDot(function(potentialDot){
      if (potentialDot.getColor() == dot.getColor()) {
        potentialDot.select();
      }
    }.bind(this));

  } // Phew! we made it out!
};

Game.prototype.connectLine = function(line, dot) {
  this.board.selectDot(dot);
  line.setTo(dot.getCenterPosition());
  line.setToDot(dot);
  this.newLine(dot);
};

Game.prototype.newLine = function(dot) {
  var line = new Game.Line(dot.getCenterPosition(), dot.getColor());
  line.appendTo(this.body$);
  line.setFromDot(dot);
  this.lines_.push(line);
};

Game.prototype.setCursorState = function(state) {
  this.state_ = state;
};

Game.prototype.replenishDots = function() {
  var dotsToAnimate = [];
  var columnsToAddDotsTo = {};
  this.board.forEachSelectedDot(function(originDot){
    var originDotPosition = originDot.getGridPosition();
    if(!columnsToAddDotsTo[originDotPosition.col]) {
      columnsToAddDotsTo[originDotPosition.col] = 0;
    }
    columnsToAddDotsTo[originDotPosition.col]++;
    this.board.forEachSelectedDotAboveDot(originDot, function(dotAbove){
        dotsToAnimate.push(dotAbove);
    }.bind(this));
  }.bind(this));

  for (var i = 0; i < dotsToAnimate.length; i++) {
    var dotsToAnimatePosition = dotsToAnimate[i].getNewGridPosition();
    var newRow = dotsToAnimatePosition.row + 1;
    dotsToAnimate[i].setNewGridPosition(
        new Game.Point(newRow, dotsToAnimatePosition.col))
    dotsToAnimate[i].animateNewGridPosition();
  };

  this.board.deleteSelectedDots();

  for(var col in columnsToAddDotsTo) {
    var num = columnsToAddDotsTo[col];
    while(num > 0) {
      setTimeout(function(num, col){
        this.board.prependDot(num - 1, parseInt(col, 10));
      }.bind(this), 200, num, col)
      num--;
    }
  }

};
