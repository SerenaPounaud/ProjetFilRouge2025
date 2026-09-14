import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    lastname: {type: String, required: true},
    firstname: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true},
    rgpd: {type: Boolean, required: true},
    dateContact: {
        type: Date,
        default: Date.now,
        immutable: true //ne peut pas être modifié après création
    }
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;