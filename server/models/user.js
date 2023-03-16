const mongoose = require('mongoose');

const collateralSchema = new mongoose.Schema({
    currency_code:{
       required:true,
       type:String
    },
    collateral_amount:{
        required:true,
        type:Number
    }
})

const userSchema = new mongoose.Schema({
    account_address: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    password:{
        required:true,
        type:String
    },
    collateral:{
        required:false,
        type:[collateralSchema]
    }

})

module.exports = mongoose.model('User', userSchema, "user")