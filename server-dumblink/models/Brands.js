'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brands.belongsTo(models.Users, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
      Brands.hasMany(models.Links, {
        as: "links",
        foreignKey: {
          name: "brandId",
        },
      });
    }
  };
  Brands.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    uniqueLink: DataTypes.STRING,
    viewCount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Brands',
  });
  return Brands;
};