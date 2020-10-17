var express = require("express");
var router = express.Router();

router.use("/data", require("./history"));

module.exports = router;
