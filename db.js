const { Pool } = require("pg"),
  pool = new Pool({
    user: "zwdfmfezofalwg",
    host: "ec2-75-101-131-79.compute-1.amazonaws.com",
    port: "5432",
    password:
      "ed6aea6560cf582a8566b53c7c29dba8dd783d76eb7fb07e960e843de62107c3",
    database: "d7fb19pgs8e316"
  });

/**Get all users */
const getUsers = (req, res) => {
  pool.query("SELECT * from customerdetails", (error, result) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json(result.rows);
    }
  });
  // res.status(200).send("<h1>get all users<h1>");
};

/** Get user by Id */
const getUserById = (req, res) => {
  const id = parseInt(req.body.username);
  const password = req.body.password;
  let projectStatu;
  console.log(req.body);

  pool.query(
    // "SELECT * FROM customerdetails WHERE " + '"userId"' + " = $1",

    'SELECT "customerdetails"."id","customerdetails"."password", "customerdetails"."name", "customerdetails"."nickname", "customerdetails"."isActive", "customerdetails"."userId", "customerdetails"."createdAt", "customerdetails"."updatedAt", "projectStatus"."projectName" AS "projectStatus.projectName", "projectStatus"."projectId" AS "projectStatus.projectId", "projectStatus"."status" AS "projectStatus.status", "projectStatus"."userId" AS "projectStatus.userId", "projectStatus"."createdAt" AS "projectStatus.createdAt", "projectStatus"."updatedAt" AS "projectStatus.updatedAt" FROM "customerdetails" AS "customerdetails" LEFT OUTER JOIN "projectStatus" AS "projectStatus" ON "customerdetails"."userId" = "projectStatus"."userId" WHERE customerdetails."userId"=$1 GROUP BY "projectStatus"."userId","customerdetails"."id","customerdetails"."password", "customerdetails"."name", "customerdetails"."nickname", "customerdetails"."isActive", "customerdetails"."userId"',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log(results.rows);
        if (results.rowCount) {
          if (results.rows[0].password === password) {
            projectStatu = getProjectStatus(id);
            result = results.rows;
            result.projects = projectStatu;
            res.status(200).json(result);
          } else {
            res.status(401).json({ data: "Incorrect password" });
          }
        } else {
          res.status(204).json({ data: "No user found" });
        }
      }
    }
  );
};

/** Create/Save new Css */
const createCss = (request, response) => {
  const { projectid, userid, date, feedback } = request.body;

  pool.query(
    "INSERT INTO cssreview (projectid, userid, status, date, feedback) VALUES ($1, $2, $3, $4, $5)",
    [projectid, userid, "save", date, feedback],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${result.rows}`);
    }
  );
};

/** Submit new Css */
const submitCss = (request, response) => {
  const { projectid, userid, date, feedback } = request.body;

  pool.query(
    "INSERT INTO cssreview (projectid, userid, status, date, feedback) VALUES ($1, $2, $3, $4, $5)",
    [projectid, userid, "submit", date, feedback],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${result}`);
    }
  );
};

/** Get css by Id */
const getCssById = (req, res) => {
  const userid = parseInt(req.query.userid);
  const projectid = parseInt(req.query.projectid);
  console.log(req.query);

  pool.query(
    "SELECT * FROM cssreview WHERE userid = $1 AND projectid = $2",
    [userid, projectid],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        if (results.rowCount) {
          res.status(200).json(results.rows);
        } else {
          res.status(204).json({ data: "No record found" });
        }
      }
    }
  );
};

/**Updaete Css */
const updateCss = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

async function getProjectStatus(userID) {
  pool.query(
    "SELECT * from projectstatus where userid = $1",
    [userID],
    (error, result) => {
      if (error) {
        throw error;
      } else {
        return result.rows;
      }
    }
  );
}

module.exports = {
  getUsers,
  getUserById,
  getCssById,
  createCss,
  submitCss,
  updateCss
};
