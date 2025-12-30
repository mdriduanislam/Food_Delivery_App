const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name must be less than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
};

module.exports = mongoose.model('User',userSchema);

