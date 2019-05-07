/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userProfile', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    imagePath: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    mobilePhone: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    settings: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    newsletter: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    addressOne: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    addressTwo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    region: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postcode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'userProfile'
  });
};
