const sequelize = require("sequelize");
const db = require("../config/database");

const CssReview = db.define(
  "CssReview",
  {
    projectId: {
      type: sequelize.INTEGER
    },
    userId: {
      type: sequelize.INTEGER
    },
    status: {
      type: sequelize.STRING
    },
    feedBack: {
      type: sequelize.JSON
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = CssReview;
