var Game = function(board$) {
  window["a"] = this;
  this.body$ = $("body");
  this.board = new Game.Board(board$);

  this.cursor_ = new Game.Cursor();
  this.header_;
  this.setupHeader_();
  this.state_ = Game.CURSOR_STATES.none;
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
  var currentLine$ = this.board.getCurrentLine();
  currentLine$.setTo(this.cursor_.getPosition());
};

Game.prototype.mouseUp_ = function(e){
  this.setCursorState(Game.CURSOR_STATES.none);

  // Remove the lines
  this.board.removeAllLines();

  // Bail early if we've only selected one
  if(this.board.countSelectedDots() <= 1){
    this.board.clearSelectedDots();
    return;
  }

  if(this.superMode) {
    var superDotColor = this.superDot.getColor();
    // Destroy all dots of this color. I know, racist.
    this.board.forEachDot(function(dot){
      if (dot.getColor() == superDotColor) {
        this.board.removedDot(dot);
      }
    }.bind(this));
    this.superMode = false;
  } else {
    this.board.forEachSelectedDot(function(dot){
      this.board.removedDot(dot);
    }.bind(this));
  }

  this.board.deleteSelectedDots();
};

Game.prototype.mouseDownDot_ = function(e){
  if(e.which != 1) return; // only left click
  this.setCursorState(Game.CURSOR_STATES.dragging);

  var $clicked = $(e.target);
  var dot = $clicked.data("dot");

  // TODO(jstanton): combine these actions.
  //     (requires maintaining lines in board).
  this.board.selectDot(dot);
  this.board.newLine(dot);
};

Game.prototype.mouseOverDot_ = function(e){
  if(this.state_ != Game.CURSOR_STATES.dragging) {
    return;
  }

  var $over = $(e.target);
  var dot = $over.data("dot");
  var $currentLine = this.board.getCurrentLine();
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
    this.board.connectLine($currentLine, dot);
  } else if(numSelected > 1 && this.board.dotThatWillUnlink(dot)) {
    // Ok so I know i've seen the dot before, and as it turns out, this is the
    // dot that will cause me to unlink my chain!
    this.board.unlinkLastLine();
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
    this.board.connectLine($currentLine, dot);

    this.board.forEachDot(function(potentialDot){
      if (potentialDot.getColor() == dot.getColor()) {
        potentialDot.select();
      }
    }.bind(this));

  } // Phew! we made it out!
};

Game.prototype.setCursorState = function(state) {
  this.state_ = state;
};
