var express = require("express");
var router = express.Router();

const { v4: uuidv4 } = require("uuid");

// const { generateShortUrl } = require("../services/shortenurl");
/* GET home page. */
router.get("/", function (req, res, next) {
  const short = uuidv4();
  // saving into object
  // urlobj.set(shorturl, url);
  // return shorturl;
  // const shorturl = generateShortUrl(
  //   "https://www.google.com/search?q=uuid&sca_esv=d204c5fe6303d08c&sxsrf=AHTn8zpzAPKiIj-fUNdBsRiv5YMBHXCD6w%3A1746267804172&source=hp&ei=nO4VaJjjB5eNvr0PhY6NYA&iflsig=ACkRmUkAAAAAaBX8rLexpHosDT45ysWf_aUwrAAoaMWm&ved=0ahUKEwiYoZfBioeNAxWXhq8BHQVHAwwQ4dUDCBc&uact=5&oq=uuid&gs_lp=Egdnd3Mtd2l6IgR1dWlkMg0QABiABBixAxhDGIoFMg0QABiABBixAxgUGIcCMg0QABiABBixAxhDGIoFMgoQABiABBhDGIoFMgoQABiABBhDGIoFMgoQABiABBhDGIoFMgoQABiABBhDGIoFMgoQABiABBhDGIoFMgUQABiABDILEAAYgAQYsQMYgwFIpgVQAFibBHAAeACQAQCYAawBoAHZA6oBAzAuM7gBA8gBAPgBAZgCA6AC5APCAgoQIxiABBgnGIoFwgIEECMYJ8ICCBAAGIAEGLEDwgIIEC4YgAQYsQOYAwCSBwMwLjOgB6QUsgcDMC4zuAfkAw&sclient=gws-wiz"
  // );

  res.render("index", { title: short });
});

module.exports = router;
