const express = require("express");
const router = express.Router();



router.get("/",(req,res)=>{
    res.send("get users");
})

router.get("/:id",(req,res)=>{
    let {id} = req.params;
    res.send(`user ${id}`);
})

module.exports = router;