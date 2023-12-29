const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get("/", controller.home);
router.post("/upload", controller.upload, controller.checkUpload);

module.exports = { router };
