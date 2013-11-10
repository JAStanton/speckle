Game.ScoreBoard = function(mode) {
  this.setMode(mode);
  this.$el_ = $("body > header");
  this.$score_ = this.$el_.find(".score");
  this.$move_;
  this.$time_;
  this.buildHeader_();
};

Game.ScoreBoard.prototype.setMode = function(mode) {
  this.mode = mode;
};

Game.ScoreBoard.prototype.buildHeader_ = function() {
  // TODO(jastanton): use soy or mustache instead of inline.
  if(this.mode == Game.MODES.time) {
    var $header = $(
        '<span class="timePanel">Time <span class="time">30</span></span>');
  }else {
    var $header = $('<span class="movesPanel">Moves <span class="moves">0</span></span>');
  }

  // TODO(jastanton): move this to a(n automated) domReady if possible.
  this.$el_.prepend($header);
  this.$move_ = this.$el_.find(".moves");
  this.$time_ = this.$el_.find(".time");
};

Game.ScoreBoard.prototype.updateScore = function(score) {
  this.$score_.text(score);
}

Game.ScoreBoard.prototype.updateMoves = function(moves) {
  this.$move_.text(moves);
}

Game.ScoreBoard.prototype.updateTime = function(moves) {
  this.$time_.text(moves);
}
