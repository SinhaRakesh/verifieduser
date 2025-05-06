var express = require("express");
var router = express.Router();
const { readAndNormalizeData } = require("../services/dataProcessor");
const db = require("../config/pgdb");
const dataVerification = require("../services/dataVerification");
const calculateTrustScore = require("../services/scoreCalculation");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/**
 * fetch data based on
 */
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
  let verifiedRecordCount = 0;
  try {
    const records = await db.query(
      "SELECT id,name,mobile,email,dob,is_verified,retry_count FROM users as u where is_verified=false limit 10;"
    );
    for (let index = 0; index < records.rows.length; index++) {
      const verifiedData = await dataVerification(records.rows[index]);
      if (verifiedData.isVerified) verifiedRecordCount++;

      // console.log(verifiedData);
    }
  } catch (err) {
    console.error(err);
    // res.status(500).send("Server error");
  }

  res.send({
    message: "Record Verified Successfully",
    verifiedRecordCount,
  });
});

// used for calculating the score for each record that is verified
router.post("/score-calculation", async function (req, res, next) {
  let recordCount = 0;
  try {
    const records = await db.query(
      "SELECT * FROM users as u where is_verified=true limit 10;"
    );
    for (let index = 0; index < records.rows.length; index++) {
      try {
        const trustScore = await calculateTrustScore(records.rows[index]);
        console.log("trustScore", trustScore.score);
        // todo update trustScore
        if (trustScore.status == "success") recordCount++;
      } catch (err) {
        // log this error/ sen to sentry for record error
        console.log("error");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }

  res.send(`success record process: ${recordCount}`);
});

router.get("/search/", async function (req, res, next) {
  const { mobile, email } = req.query;

  const mobileRegex = /^[0-9]{10}$/; // for a 10-digit mobile number
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email regex

  try {
    let query = "SELECT * FROM users WHERE ";
    const conditions = [];

    if (mobile && mobileRegex.test(mobile)) {
      conditions.push(`mobile = '${mobile}'`);
    }

    if (email && emailRegex.test(email)) {
      conditions.push(`email = '${email}'`);
    }

    if (conditions.length > 0) {
      query += conditions.join(" and "); // Combine conditions with OR
    } else {
      return res.status(400).send("Invalid query parameters");
    }
    console.log(query);
    const result = await db.query(query);
    if (result.rows.length) {
      res.send({
        isVerified: result.rows[0].isVerified ? true : false,
        score: result.rows[0].trust_score ? result.rows[0].trust_score : 0,
      });
    } else {
      res.status(404).send({
        isVerified: false,
        score: 0,
        message:
          "No records found for the provided mobile number or email address.", // Added message
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
