const express = require("express");

const router = express.Router();

const {getUser,postUser,getUpdate,getDelete,sendEmail} = require("../controllers/user");

router.get("/getUser",getUser);
router.post("/postUser",postUser);
router.put("/User/:id",getUpdate);
router.delete("/User/:id",getDelete);
router.post("/send-email",sendEmail);
module.exports=router; 