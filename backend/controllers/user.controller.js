import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Signup
export const signup = async (req, res, next) => {
    try {
        const {lastname, firstname, email, password, cgu} = req.body; //récupère les données du body

        const existingUser = await User.findOne({email:email}); //vérifie si user existe
        if (existingUser) return res.status(400).json({message: "Email déjà utilisé"});

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10); //niveau de sécurité

        //créer user
        const user = new User({
            lastname,
            firstname,
            email,
            password: hashedPassword,
            cgu
        });

        await user.save();
        res.status(200).json({message: "Utilisateur ajouté", user});
    } catch (error) {
        next(error);
    }
};

//Signin
export const signin = async (req, res, next) => {
    try {
         const {email, password} = req.body;

         //vérifie user
         const user = await User.findOne({email:email});
         if (!user) return res.status(404).json({message: "Email ou mot de passe incorrect"});

         //compare password
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) return res.status(404).json({message: "Email ou mot de passe incorrect"});

         //génère un token
         const token = jwt.sign(
            {userId: user._id,lastname: user.lastname},
            process.env.JWT_SECRET, //ajoute la clé secrète (mot de passe serveur)
            {expiresIn: "1d"}
         );
         res.status(201).json({token});
         
    } catch (error) {
        next(error);
    }
}
