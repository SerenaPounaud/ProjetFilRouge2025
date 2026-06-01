import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    lastname: String,
    firstname: String,
    email: String,
    message: String,
    rgpd: Boolean,
    dateContact: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;