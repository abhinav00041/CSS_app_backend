const sequelize = require("sequelize");
const db = require("../config/database");
const customrDetails = require("./CustomerDetails");

const ProjectStatus = db.define(
  "projectStatus",
  {
    projectName: {
      type: sequelize.STRING
    },
    projectId: {
      type: sequelize.INTEGER
    },
    status: {
      type: sequelize.STRING
    },
    userId: {
      type: sequelize.INTEGER,
      references: {
        model: customrDetails,
        key: "userId"
      }
    }
  },
  { freezeTableName: true }
);
// const AddProject = function() {
//   const data = {
//     projectName: "lilly Demo",
//     projectId: 54124,
//     status: "new",
//     userId: 112233
//   };
//   let { projectId, projectName, status, userId } = data;

//   ProjectStatus.create({
//     projectName: projectName,
//     projectId: projectId,
//     status: status,
//     userId: userId
//   })
//     .then(project => {
//       console.log(project);
//     })
//     .catch(err => {
//       console.log("Error in Add Project");
//     });
// };

module.exports = ProjectStatus;
