const fs = require("fs");
const path = require("path");
const db = require("../config/pgdb");
const moment = require("moment");

const defaultFilePath = path.join(
  __dirname,
  "../csvData/term-visitor-2016-08-02-06-28-18pm.csv"
);

// Function to format date
const formatDate = (dateString) => {
  const possibleFormats = [
    "DD-MM-YYYY",
    "DD/MM/YYYY",
    "DD MM YYYY",
    "MM-DD-YYYY",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
  ];

  const formattedDate2 = moment(dateString, possibleFormats, true);
  if (formattedDate2.isValid()) {
    return formattedDate2.format("YYYY-MM-DD");
  }

  return dateString;
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
      if (normalizedEntry) normalizedData.push(normalizedEntry);
    }
  }

  //write into db
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
      result.rows;
    } catch (err) {
      console.error(err);
    }
  }

  return normalizedData;
};

// const data = readAndNormalizeData(filePath);
module.exports = {
  normalizeData,
  readAndNormalizeData,
};
