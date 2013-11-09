Game.Header = function(mode) {
  this.setMode(mode);
  this.$el_ = $("body > header");
  this.$score_ = this.$el_.find(".score");
  this.$move_;
  this.$time_;
  this.buildHeader_();
};

Game.Header.MODES = {
  "time": 0,
  "moves": 1,
}

Game.Header.prototype.setMode = function(mode) {
  this.mode = mode;
};

Game.Header.prototype.buildHeader_ = function() {
  // todo: use soy or mustache instead of inline.
  if(this.mode == Game.Header.MODES.time) {
    var $header = $(
        '<span class="timePanel">Time <span class="time">30</span></span>');
  }else {
    var $header = $('<span class="movesPanel">Moves <span class="moves">0</span></span>');
  }

  // todo: move this to a(n automated) domReady if possible.
  this.$el_.prepend($header);
  this.$move_ = this.$el_.find(".moves");
  this.$time_ = this.$el_.find(".time");
};

Game.Header.prototype.updateScore = function(score) {
  this.$score_.text(score);
}

Game.Header.prototype.updateMoves = function(moves) {
  this.$move_.text(moves);
}

Game.Header.prototype.updateTime = function(moves) {
  this.$time_.text(moves);
}
