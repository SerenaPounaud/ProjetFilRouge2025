import Contact from "../models/contact.model.js";

//Ajoute un message
export const sendMessage = async (req, res, next) => {
    try {
        const message = new Contact(req.body);
        await message.save(); //sauvegarde dans la db

        res.json({message: "Message envoyé", data: message});
        
    } catch (error) {
        next(error);
    }
};