const emailVerification = require("./dataVerification/emailVerification");
const mobileVerification = require("./dataVerification/mobileVerification");
const aadharVerification = require("./dataVerification/aadharVerification");
const db = require("../config/pgdb");
/**
 * 
 * @param {*} dataObj 
 * {
    name:""
    email:"",
    mobile:"",
    dob:"",
    id:""
 }
  */

const dataVerification = async function (dataObj) {
  const verification = {
    isEmailVerified: false,
    isMobileVerified: false,
    isDobVerified: false,
    isAadharVerified: false,
    isLinkedInVerified: false,
  };

  // todo call respective service based on detail available in dataObj
  if (dataObj.mobile) {
    verification.isMobileVerified = await mobileVerification(dataObj.mobile);
  }
  if (dataObj.email) {
    verification.isEmailVerified = await mobileVerification(dataObj.email);
  }

  verification.aadharVerification = await aadharVerification(dataObj);
  // todo calculate score based on verification

  // update record data varification in db
  let isVerified =
    Object.values(verification).some((status) => status) || false;

  try {
    const result = await db.query(
      `UPDATE users SET is_verified = ${isVerified}, 
        is_email_verified = ${verification.isEmailVerified}, 
        is_mobile_verified = ${verification.isMobileVerified},
        is_aadhar_verified = ${verification.isAadharVerified} 
        WHERE id = ${dataObj.id}`
    );
  } catch (err) {
    console.error(err);
    isVerified = false;
  }

  return {
    ...dataObj,
    verification,
    isVerified,
  };
};

module.exports = dataVerification;
