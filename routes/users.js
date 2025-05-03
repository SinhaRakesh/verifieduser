var express = require("express");
var router = express.Router();
const { readAndNormalizeData } = require("../services/dataProcessor");
const db = require("../config/pgdb");
const dataVerification = require("../services/dataVerification");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/normalizedata", async function (req, res, next) {
  await readAndNormalizeData();
  res.send("senitizedata successfully");
});

router.get("/list", async function (req, res, next) {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
  res.end();
});

router.post("/verification-process", async function (req, res, next) {
  try {
    const records = await db.query(
      "SELECT id,name,mobile,email,dob,is_verified,retry_count FROM users as u where is_verified=false limit 10;"
    );
    for (let index = 0; index < records.rows.length; index++) {
      const verifiedData = await dataVerification(records.rows[index]);
      console.log(verifiedData);
    }
  } catch (err) {
    console.error(err);
    // res.status(500).send("Server error");
  }

  res.send("hello");
});

module.exports = router;
