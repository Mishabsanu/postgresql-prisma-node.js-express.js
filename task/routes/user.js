const  verifyRefreshToken = require("../middleware/authUser");


const express = require("express");
const router = express.Router();
const {
    userSignup,
    userLogin,
    dashboard,


} = require("../controllers/user");

router.post("/signup",userSignup);
router.post("/login", userLogin);
router.get("/dashboard", verifyRefreshToken,dashboard);


module.exports = router;