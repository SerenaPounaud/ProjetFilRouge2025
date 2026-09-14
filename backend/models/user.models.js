import mongoose from 'mongoose'; //permet de définir des schémas + connection node/mongodb

const userSchema = new mongoose.Schema({
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, default: false}, //ne récupère pas le champ auto
    cgu: { type: Boolean, required: true, default: false},
    role: {
        type: String, 
        enum: ["user", "admin"], 
        default: "user"
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;
