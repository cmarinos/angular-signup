const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD, {
        dialect: 'mysql',
        port: 3306,
        host: 'localhost',
        logging: false,
        operatorsAliases: false
    });

module.exports = sequelize;
