import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ //créer une instance
    lastname : String,
    firstname : String,
    email : String,
    password : String,
    cgu : Boolean
});

const User = mongoose.model("User", userSchema);
export default User;