const fs = require("fs");
const path = require("path");
const db = require("../config/pgdb");
const dayjs = require("dayjs");

const defaultFilePath = path.join(
  __dirname,
  "../csvData/term-visitor-2016-08-02-06-28-18pm.csv"
);

// Function to format date
const formatDate = (dateString) => {
  const formats = ["DD-MM-YYYY", "DD MMM YYYY"];

  for (const format of formats) {
    const parsedDate = dayjs(dateString, format, true); // Strict parsing
    if (parsedDate.isValid()) {
      return parsedDate.format("YYYY-MM-DD"); // Convert to YYYY-MM-DD
    }
  }

  return dateString; // Return original
};

const normalizeData = async function (inputString) {
  // const components = inputString.split(",").map((item) => item.trim());
  // Define individual regex components
  const nameRegex = `(?<name>[A-Za-z\\s]+)`;
  const dobRegex = `(?<dob>(\\d{1,2}[-\\s]\\d{1,2}[-\\s]\\d{4}|\\d{1,2}\\s\\w+\\s\\d{4}|\\d{4}\\s\\w+\\s\\d{1,2})?)`;
  const emailRegex = `(?<email>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})?`;
  const mobileRegex = `(?<mobile>\\d{10})?`;

  const regexPattern = `${nameRegex},?\\s*${dobRegex},?\\s*${emailRegex},?\\s*${mobileRegex}`;
  const regex = new RegExp(regexPattern);

  const match = inputString.match(regex);
  if (match && match.groups) {
    return {
      name: match.groups.name ? match.groups.name.trim() : null,
      dob: match.groups.dob ? formatDate(match.groups.dob.trim()) : null,
      email: match.groups.email ? match.groups.email.trim() : null,
      mobile: match.groups.mobile ? match.groups.mobile.trim() : null,
    };
  }
  return null; // Return null if no match is found
};

const readAndNormalizeData = async function (filePath = null) {
  if (!filePath) filePath = defaultFilePath;
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.split("\n");
  const normalizedData = [];

  // lines.length;
  for (let i = 0; i < 5; i++) {
    // Start from 1 to skip header
    const line = lines[i].trim();
    if (line) {
      const normalizedEntry = await normalizeData(line);
      console.log(normalizedEntry);
      if (normalizedEntry) normalizedData.push(normalizedEntry);
    }
  }
  console.log("normalizedData", normalizedData.length);
  if (normalizedData.length) {
    try {
      // Bulk insert normalized data into the database
      const insertQuery = `
      INSERT INTO users (name, dob, email, mobile)
      VALUES ${normalizedData
        .map(
          (entry) =>
            `('${entry.name}', '${entry.dob}', '${entry.email}', '${entry.mobile}')`
        )
        .join(", ")}
      RETURNING *;
    `;
      const result = await db.query(insertQuery);
      res.send("Inserted data:", result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }

  return normalizedData;
};

// const data = readAndNormalizeData(filePath);
module.exports = {
  normalizeData,
  readAndNormalizeData,
};
