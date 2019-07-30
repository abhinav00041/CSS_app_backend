const customerdetails = require("./models/CustomerDetails");
const projectdetails = require("./models/ProjectDetails");
const cssreview = require("./models/CssReview");
const projectStatus = require("./models/ProjectStatus");
const sequelize = require("sequelize");
const async = require('async');
const nodemailer = require('nodemailer');


const getUsers = (req, res) => {
  customerdetails.findAll().then(users => {
    console.log("All users:", JSON.stringify(users, null, 4));
    // projectStatus.AddProject();
    res.status(200).send(JSON.stringify(users, null, 4));
  });
};

/** Get user by Id */
getUserById = async (req, res) => {
  const id = parseInt(req.body.username);
  const password = req.body.password;
  console.log(req.body);
  customerdetails
    .findAll({
      where: { userId: id },
      include: [
        {
          model: projectStatus,
          as: "projectStatus"
        }
      ]
    })
    .then(result => {
      if (!result.length) {
        res.status(200).json({ data: "User Not found" });
      } else {
        if (result[0].password === password) {
          res.status(200).json(result);
        } else {
          res.status(401).json({ data: "Incorrect password" });
        }
      }
    })
    .catch(err => {
      console.log("ERR" + err);
      res.status(500).json({ Error: err });
    });
};

/** Create/Save new Css */
const createCss = (req, res) => {
  console.log(req.body);
  async.map(req.body, function(object, cb) {
    const { projectid, userid, feedback } = object;
    cssreview
      .findAll({
        where: {
          projectId: projectid,
          userId: userid,
          status: "saved"
        }
      })
      .then(data => {
        if (!data.length) {
          // Save new entry
          cssreview
            .upsert({
              projectId: projectid,
              userId: userid,
              feedBack: feedback,
              status: "saved"
            })
            .then(result => {
              console.log("Result" + JSON.stringify(result));
              updateStaus("saved", projectid, userid);
              // response.sendStatus(201).json(result);
              if (result) {
                cb(null,{status:"ok", statuscode:200,value :"Successfully stored"});
              } else {
                cb(null,{status : "ok",statuscode:200 ,value :"Successfully inserted"});
              }
            })
            .catch(err => {
              console.log("Error in Add Project", err);
              cb({status : "error",statuscode:500 ,value :"Error in Add Project"+ err});
  
            });
        } else {
          cssreview
            .update(
              { feedBack: feedback },
              {
                where: {
                  projectId: projectid,
                  userId: userid
                }
              }
            )
            .then(result11 => {
              cb(null,{status : "ok",statuscode:200 ,value :"Updated saved css"});
            });
        }
      });  
  }, function(error, results) {
    if (error) return res.status(500).send(error);
    console.log(results);
    res.send(results);
  });
  // const { projectid, userid, feedback } = req.body;
  // cssreview
  //   .findAll({
  //     where: {
  //       projectId: projectid,
  //       userId: userid,
  //       status: "saved"
  //     }
  //   })
  //   .then(data => {
  //     if (!data.length) {
  //       // Save new entry
  //       cssreview
  //         .upsert({
  //           projectId: projectid,
  //           userId: userid,
  //           feedBack: feedback,
  //           status: "saved"
  //         })
  //         .then(result => {
  //           console.log("Result" + JSON.stringify(result));
  //           updateStaus("saved", projectid, userid);
  //           // response.sendStatus(201).json(result);
  //           if (result) {
  //             res.send({status:"ok", statuscode:200,value :"Successfully stored"});
  //           } else {
  //             res.send({status : "ok",statuscode:200 ,value :"Successfully inserted"});
  //           }
  //         })
  //         .catch(err => {
  //           console.log("Error in Add Project", err);
  //           res.status(500).send({status : "error",statuscode:500 ,value :"Error in Add Project"+ err});

  //         });
  //     } else {
  //       cssreview
  //         .update(
  //           { feedBack: feedback },
  //           {
  //             where: {
  //               projectId: projectid,
  //               userId: userid
  //             }
  //           }
  //         )
  //         .then(result11 => {
  //           res.status(200).send({status : "ok",statuscode:200 ,value :"Updated saved css"});
  //         });
  //     }
  //   });


};

/** Submit new Css */
const submitCss = (req, res) => {
  console.log(req.body);
  async.map(req.body, function(object, cb) {
    const { projectid, userid, feedback } = object;
    cssreview
      .findAll({
        where: {
          projectId: projectid,
          userId: userid,
          status: "saved"
        }
      })
      .then(data => {
        if (!data.length) {
          // Save new entry
          cssreview
            .upsert({
              projectId: projectid,
              userId: userid,
              feedBack: feedback,
              status: "submited"
            })
            .then(result => {
              console.log("Result" + JSON.stringify(result));
              updateStaus("submited", projectid, userid);
              // response.sendStatus(201).json(result);
              if (result) {
                cb(null,{status:"ok", statuscode:200,value :"Successfully stored"});
              } else {
                cb(null,{status:"ok", statuscode:200,value :"Successfully inserted"});
              }
            })
            .catch(err => {
              cb({status : "error",statuscode:500 ,value :"Error in Add Project"+ err});
            });
        } else {
          cssreview
            .update(
              { feedBack: feedback, status: "submited" },
              {
                where: {
                  projectId: projectid,
                  userId: userid
                }
              }
            )
            .then(result11 => {
              updateStaus("submited", projectid, userid);
            cb(null,{status : "ok",statuscode:200 ,value :"Submit css"});
            });
        }
      });
  }, function(error, results) {
    if (error) return res.status(500).send(error);
    console.log(results);
    (async function () {
      await sendEmail(req.body).catch((err)=>{console.log(err)});
    }())
    res.send(results);
  });

  // const { projectid, userid, feedback } = req.body;
  // cssreview
  //   .findAll({
  //     where: {
  //       projectId: projectid,
  //       userId: userid,
  //       status: "saved"
  //     }
  //   })
  //   .then(data => {
  //     if (!data.length) {
  //       // Save new entry
  //       cssreview
  //         .upsert({
  //           projectId: projectid,
  //           userId: userid,
  //           feedBack: feedback,
  //           status: "submited"
  //         })
  //         .then(result => {
  //           console.log("Result" + JSON.stringify(result));
  //           updateStaus("submited", projectid, userid);
  //           // response.sendStatus(201).json(result);
  //           if (result) {
  //             res.send({status:"ok", statuscode:200,value :"Successfully stored"});
  //           } else {
  //             res.send({status:"ok", statuscode:200,value :"Successfully inserted"});
  //           }
  //         })
  //         .catch(err => {
  //           res.status(500).send({status : "error",statuscode:500 ,value :"Error in Add Project"+ err});
  //         });
  //     } else {
  //       cssreview
  //         .update(
  //           { feedBack: feedback, status: "submited" },
  //           {
  //             where: {
  //               projectId: projectid,
  //               userId: userid
  //             }
  //           }
  //         )
  //         .then(result11 => {
  //           updateStaus("submited", projectid, userid);
  //           res.status(200).send({status : "ok",statuscode:200 ,value :"Submit css"});
  //         });
  //     }
  //   });
};

/** Get css by Id */
const getCssById = (req, res) => {
  const userid = parseInt(req.query.userid);
  const projectid = parseInt(req.query.projectid);
  console.log(req.query);

  cssreview
    .findAll({
      where: { userId: userid, projectId: projectid }
    })
    .then(result => {
      console.log("Result" + JSON.stringify(result));
      // response.sendStatus(201).json(result);
      if (result) {
        res.status(200).send(result);
      }
    })
    .catch(err => {
      console.log("Error in Find CSS", err);
    });
};

async function updateStaus(status, project, user) {
  projectStatus
    .update(
      {
        status: status
      },
      { where: { projectId: project, userId: user } }
    )
    .then(update => {
      console.log(update);
    });
}
const sendEmail = async (object)=>{
  return new Promise((resolve,reject)=>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    secureConnection: true,
    auth: {
           user: 'csstcs2@gmail.com',
           pass: 'qwerty@123'
       },
       tls: {
        rejectUnauthorized: false
    }
   });
  let projectlist ='';
   object.forEach((el)=>{
    projectlist += `<br><h3>${el.projectid} | ${el.projectname}  |  ${el.CalculatedValue}</h3><br>`
   })
   const mailOptions = {
    from: 'csstcs2@gmail.com', // sender address
    to: 'ktyagi788@gmail.com;roshan1.j@tcs.com', // list of receivers
    subject: 'TCS Customer satisfaction feedback form Submitted by '+object[0].UserName, // Subject line
    html:`<body>
    <h3>Hi Dear,</h3><br>
    <h3>Mr. ${object[0].UserName}  have submitted TCS CSS feedback form for below                   project list :- </h3>
    <h2>ProjectId | ProjectName  |      Calculated Value   </h2>
    ${projectlist}
    <h3>User data</h3>
    <p><strong>User Name:</strong>${object[0].UserName}</p>
    <p><strong>Submitted Date:</strong>${new Date().toLocaleDateString()}</p>
    <p><strong>Time:</strong>${new Date().toLocaleTimeString()}</p>
</body>`// plain text body
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      reject(err)
    else
      resolve(info);
 });
})
}

module.exports = {
  getUsers,
  getUserById,
  getCssById,
  createCss,
  submitCss
};
