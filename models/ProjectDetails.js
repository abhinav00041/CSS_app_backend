const sequelize = require("sequelize");
const db = require("../config/database");

const ProjectDetails = db.define("ProjectDetails", {
  projectId: {
    type: sequelize.INTEGER
  },
  projectName: {
    type: sequelize.STRING
  },
  onSiteManager: {
    type: sequelize.INTEGER
  },
  onSitePOC: {
    type: sequelize.INTEGER
  },
  offShoreManager: {
    type: sequelize.INTEGER
  },
  offShorePOC: {
    type: sequelize.INTEGER
  },
  FYI: {
    type: sequelize.ARRAY(sequelize.TEXT)
  },
  Highlights1: {
    type: sequelize.TEXT
  },
  Highlights2: {
    type: sequelize.TEXT
  },
  Highlights3: {
    type: sequelize.TEXT
  }
});

module.exports = ProjectDetails;
