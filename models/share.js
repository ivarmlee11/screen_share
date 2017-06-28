'use strict';
module.exports = function(sequelize, DataTypes) {
  var share = sequelize.define('share', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return share;
};