Game.Dot = function(x, y) {
  this.offset_ = {};
  this.position = new Game.Point(x, y);
  this.gridPosition_ = new Game.Point(0, 0);
  this.newGridPosition_ = new Game.Point(0, 0);
  this.color_ = Game.colors.random();
  this.el$_ = $("<span class='dot " + this.color_ + "' />");
  this.el$_.css({
    width: Game.Dot.WIDTH,
    height: Game.Dot.HEIGHT
  })
  this.selectState_ = Game.Dot.SELECT_STATE.none;
};

Game.Dot.PADDING = 20;

Game.Dot.WIDTH = 20;

Game.Dot.HEIGHT = 20;

Game.Dot.SELECT_STATE = {
  "none": 0,
  "animating": 1
}

Game.Dot.prototype.getSelectState = function(state) {
  return this.selectState_;
}

Game.Dot.prototype.setSelectState = function(state) {
  this.selectState_ = state;
}

Game.Dot.prototype.select = function() {
  this.el$_.addClass("selected");
  this.setSelectState(Game.Dot.SELECT_STATE.animating);
  this.el$_.one("webkitAnimationEnd", this.removeSelectAnimation_.bind(this));
}

Game.Dot.prototype.removeSelectAnimation_ = function() {
  this.setSelectState(Game.Dot.SELECT_STATE.none);
  this.el$_.removeClass("selected");
}

Game.Dot.validateMove = function(origin, move) {
  var originGridPosition = origin.getGridPosition();
  var moveGridPosition = move.getGridPosition();

  if(origin != move
    && origin.getColor() == move.getColor()
    && (
      originGridPosition.row == moveGridPosition.row - 1 &&
      originGridPosition.col == moveGridPosition.col ||

      originGridPosition.row == moveGridPosition.row + 1 &&
      originGridPosition.col == moveGridPosition.col ||

      originGridPosition.row == moveGridPosition.row &&
      originGridPosition.col == moveGridPosition.col - 1||

      originGridPosition.row == moveGridPosition.row &&
      originGridPosition.col == moveGridPosition.col + 1
    )) {
    return true;
  }
  return false;
}

Game.Dot.prototype.remove = function() {
  this.el$_.addClass("fade").delay(150).queue(function(){
    $(this).remove()
  })
};

Game.Dot.prototype.domReady = function() {
  this.el$_.data("dot", this);
  this.el$_.html( this.gridPosition_.row + ", " + this.gridPosition_.col );
  // console.log(this.gridPosition_.row + ", " + this.gridPosition_.col)
};

Game.Dot.prototype.getPosition = function() {
  return this.position;
};

Game.Dot.prototype.getCenterPosition = function() {
  return new Game.Point(
      this.position.x + (Game.Dot.WIDTH / 2), this.position.y + (Game.Dot.HEIGHT / 2));
};

Game.Dot.prototype.getColor = function() {
  return this.color_;
};

Game.Dot.prototype.appendTo = function(el$) {
  this.el$_.appendTo(el$);
};

Game.Dot.prototype.setGridPosition = function(row, col, centerOffsets) {
  if(!centerOffsets) {
    centerOffsets = Game.helpers.calcCenterOffsetForDots();
  }
  this.gridPosition_ = new Game.Point(row, col);
  this.newGridPosition_ = new Game.Point(row, col);

  var x = col * Game.Dot.WIDTH + (Game.Dot.PADDING * col) + centerOffsets.offsetLeft;
  var y = row * Game.Dot.HEIGHT + (Game.Dot.PADDING * row) + centerOffsets.offsetTop;

  this.position = new Game.Point(x, y);
  this.el$_.css({
    "left": x,
    "top": y
  });
  this.el$_.html( this.gridPosition_.row + ", " + this.gridPosition_.col );
}

Game.Dot.prototype.getGridPosition = function() {
  return this.gridPosition_;
}

Game.Dot.prototype.getNewGridPosition = function() {
  return this.newGridPosition_;
}

Game.Dot.prototype.setNewGridPosition = function(position) {
  this.newGridPosition_ = position;

}

Game.Dot.prototype.animateNewGridPosition = function(delay) {
  var newGridPosition = this.getNewGridPosition();
  this.setGridPosition(newGridPosition.row, newGridPosition.col);
}
