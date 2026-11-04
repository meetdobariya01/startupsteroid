const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const ctrl = require("../controllers/applicationController"); 

// 👇 THIS WILL TELL US EXACTLY WHAT IS BROKEN 👇
console.log("[DEBUG applicationRoutes]", {
  protect: typeof protect,
  upload: typeof upload,
  uploadArray: typeof upload?.array,
  ctrl: typeof ctrl,
  createApplication: typeof ctrl?.createApplication,
});

router.post(
  "/complete",
  protect,
  upload.array("pitchDeck", 5),
  ctrl.createApplication 
);

module.exports = router;