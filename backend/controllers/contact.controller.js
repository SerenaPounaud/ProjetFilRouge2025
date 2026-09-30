import Contact from "../models/contact.model.js";

//Ajoute un message
export const sendMessage = async (req, res, next) => {
    try {
        const message = new Contact({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            message: req.body.message,
            rgpd: req.body.rgpd
        });

        await message.save();

        res.status(201).json({message: "Message envoyé"});

    } catch (error) {
        next(error);
    }
};