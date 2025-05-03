const emailVerification = require("./dataVerification/emailVerification");
const mobileVerification = require("./dataVerification/mobileVerification");

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
  };

  // todo call respective service based on detail available in dataObj

  return {
    ...dataObj,
    verification,
  };
};

module.exports = dataVerification;
