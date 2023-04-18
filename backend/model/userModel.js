const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        minLength: [5, "Name should be more than 5 charectors"],
        maxLength: [30, "Name should not exceed 30 charectors"]
    },
    email: {
        type: String,
        required: [true, "Enter your email address"],
        validate: [validator.isEmail, "Please Enter a valid email"],
        unique: [true, "Email already registered"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "Password should have more than 8 charectors"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// make password encrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hashSync(this.password, 10);
})


// create token 
userSchema.methods.getUserToken = function() {
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
};



module.exports = mongoose.model("User", userSchema)