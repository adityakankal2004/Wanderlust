const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const validateMongoId = require("../utils/mongoValidator.js");
const {isLoggedIn , isOwner,isReviewAuthor} = require("../middleware.js");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
//Index route
router.get("/",(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//Create Route
router.post("/",isLoggedIn,wrapAsync,upload.single("listing[image]"),(async (req,res,next)=>{
    res.send(req.file);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
    
}));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, validateMongoId,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));


//Show route
router.get("/:id",validateMongoId,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },
}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//Update route
router.put("/:id",isLoggedIn,isOwner,validateMongoId,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,isReviewAuthor,validateMongoId,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}));

module.exports = router;