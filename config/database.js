const pg = require("pg");
pg.defaults.ssl = true;
const Sequelize = require("sequelize");

// Option 1: Passing parameters separately
const db = new Sequelize(
 process.env.DB,
 process.env.USER,
 process.env.PASSWORD,
  {
    host: process.env.DB_URI,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Option 2: Using a connection URI
// const db = new Sequelize(
//   "db_uri"
// );

module.exports = db;
