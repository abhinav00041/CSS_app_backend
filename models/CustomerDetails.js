const sequelize = require("sequelize");
const db = require("../config/database");
const projectstatus = require("./ProjectStatus");

const CustomerDetail = db.define(
  "customerdetails",
  {
    name: {
      type: sequelize.STRING
    },
    nickname: {
      type: sequelize.STRING
    },
    isActive: {
      type: sequelize.BOOLEAN
    },
    userId: {
      type: sequelize.INTEGER
    },
    password: {
      type: sequelize.STRING
    }
  },
  { freezeTableName: true }
);
CustomerDetail.hasMany(projectstatus, {
  as: "projectStatus",
  foreignKey: "userId",
  sourceKey: "userId"
});
module.exports = CustomerDetail;
