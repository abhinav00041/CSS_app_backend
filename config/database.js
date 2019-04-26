const pg = require("pg");
pg.defaults.ssl = true;
const Sequelize = require("sequelize");

// Option 1: Passing parameters separately
const db = new Sequelize(
  "d7fb19pgs8e316",
  "zwdfmfezofalwg",
  "ed6aea6560cf582a8566b53c7c29dba8dd783d76eb7fb07e960e843de62107c3",
  {
    host: "ec2-75-101-131-79.compute-1.amazonaws.com",
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
//   "postgres://zwdfmfezofalwg:ed6aea6560cf582a8566b53c7c29dba8dd783d76eb7fb07e960e843de62107c3@ec2-75-101-131-79.compute-1.amazonaws.com:5432/d7fb19pgs8e316"
// );

module.exports = db;
