const mongoose = require("mongoose");
const ExpressError = require("./ExpressError.js");

function validateMongoId(req,res,next){
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next(new ExpressError(404,"Invalid Listings"));
    }
    next();
}
module.exports = validateMongoId;
