var express = require("express");
var router = express.Router();
const { readAndNormalizeData } = require("../services/dataProcessor");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/normalizedata", async function (req, res, next) {
  await readAndNormalizeData();
  res.send("senitizedata successfully");
});

module.exports = router;
