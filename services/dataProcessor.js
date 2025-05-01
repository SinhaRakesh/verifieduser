const fs = require("fs");
const path = require("path");

const defaultFilePath = path.join(
  __dirname,
  "../csvData/term-visitor-2016-08-02-06-28-18pm.csv"
);

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
      dob: match.groups.dob ? match.groups.dob.trim() : null,
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
      // normalizedData.push(normalizedEntry);
    }
  }
  return normalizedData;
};

// const data = readAndNormalizeData(filePath);
module.exports = {
  normalizeData,
  readAndNormalizeData,
};
