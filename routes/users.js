var express = require("express");
var router = express.Router();
const { readAndNormalizeData } = require("../services/dataProcessor");
const db = require("../config/pgdb");

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

module.exports = router;
