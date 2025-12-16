module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    publisherId: DataTypes.STRING,
    name: DataTypes.STRING,
    platform: DataTypes.ENUM('ios', 'android'),
    storeId: DataTypes.STRING,
    bundleId: DataTypes.STRING,
    appVersion: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN,
  }, {});
  return Game;
};
