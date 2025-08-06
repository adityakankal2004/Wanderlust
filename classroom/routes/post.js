const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Posts page");
});
 
router.get("/:id",(req,res)=>{
    let {id} = req.params;
    res.send(`Post is ${id}`);
});

module.exports = router;