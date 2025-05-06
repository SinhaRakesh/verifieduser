const db = require("../config/pgdb");
const calculateTrustScore = async function calculateTrustScore(record) {
  const factorScore = {
    aadhaarLinked: 25,
    panLinked: 25,
    mobileVerified: 15,
    emailVerified: 15,
    socialProfileFound: 10,
    dobVerified: 10,
  };
  let score = 0;

  if (record.is_aadhar_verified) score += factorScore.aadhaarLinked;
  if (record.is_pan_verified) score += factorScore.panLinked;
  if (record.is_mobile_verified) score += factorScore.mobileVerified;
  if (record.is_email_verified) score += factorScore.emailVerified;
  if (record.is_linkedIn_verified) score += factorScore.socialProfileFound;

  score = Math.min(score, 100);

  try {
    const result = await db.query(
      `UPDATE users SET trust_score = ${score}
      WHERE id = ${record.id}`
    );
  } catch (err) {
    console.error(err);
    return {
      status: "failed",
      score: score,
    };
  }

  return {
    status: "success",
    score: score,
  };
};

module.exports = calculateTrustScore;
