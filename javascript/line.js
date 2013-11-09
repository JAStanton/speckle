Game.Line = function(from, to, colorName) {
  if(!colorName && typeof to == "string"){
    colorName = to;
    this.to_ = from;
  }
  this.el$_ = $("<span class='line " + colorName + "'>");

  this.from_ = from;
  this.to_ = to;
  this.fromDot = null;
  this.toDot = null;
  this.updatePosition_();

  // var anchor = this.getPiecePosition(from);

  // this.el$_.data("anchor", {offset: function(){
  //   return {
  //     left: anchor.left,
  //     top: anchor.top
  //   }}});
  // this.el$_.data("anchorEl", from);

  // this.$body.append(el$);
  // this.lines_.push(el$);
};

Game.Line.prototype.remove = function() {
  this.el$_.remove();
};

Game.Line.prototype.setFrom = function(point) {
  this.from_ = point;
  this.updatePosition_();
};

Game.Line.prototype.setTo = function(point) {
  this.to_ = point;
  this.updatePosition_();
};

Game.Line.prototype.setFromDot = function(dot) {
  this.fromDot = dot;
};

Game.Line.prototype.getFromDot = function(dot) {
  return this.fromDot;
};

Game.Line.prototype.setToDot = function(dot) {
  this.toDot = dot;
};

Game.Line.prototype.updatePosition_ = function() {
  var distance = Game.helpers.distance(this.from_, this.to_) + "px";
  var angle = Game.helpers.angle(this.from_, this.to_);
  this.el$_.css({
    "top": this.from_.top,
    "left": this.from_.left,
    "width": distance,
    "-webkit-transform": "rotate(" + (angle * -1 + 90) + "deg)"
  });
}

Game.Line.prototype.getPosition = function() {
  var x = this.from_.top;
  var y = this.from_.left

  return new Game.Point(x, y);
}

Game.Line.prototype.appendTo = function(el$) {
  this.el$_.appendTo(el$);
};
