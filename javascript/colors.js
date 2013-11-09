Game.colors = ["yellow", "green", "purple", "blue", "red"];
Game.colors.random = function() {
  return Game.colors[Game.helpers.randomBetween(0, Game.colors.length)];
};
