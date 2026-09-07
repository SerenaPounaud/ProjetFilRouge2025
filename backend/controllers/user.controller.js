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
            const token = jwt.sign(
                {userId: user._id, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: "3h"}
            );
            // cookie hhtponly, risque csrf
            res.cookie("token", token, {
                httpOnly: true, //empêche l'accès au cookie depuis le JS
                secure: process.env.NODE_ENV === "production", //interception réseau
                sameSite: "lax", //empêche l'envoi du cookie depuis un autre domaine
                maxAge: 3*60*60*1000 //3h
            });
        return res.status(201).json({message: "Utilisateur créé", expiresAt: Date.now() + 3*60*60*1000});
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

        const token = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "3h"}
        );
        //cookie httponly
        res.cookie("token", token, {
            httpOnly: true, //empêche l'accès au cookie depuis le JS
            secure: process.env.NODE_ENV === "production", //interception réseau
            sameSite: "lax", //empêche l'envoi du cookie depuis un autre domaine
            maxAge: 3*60*60*1000 //3h
        });
        res.status(200).json({message: "Connexion réussie", expiresAt: Date.now() + 3*60*60*1000});
    } catch (error) {
        next(error);
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", { //supprime le cookie
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
    return res.status(200).json({ message: "Déconnecté" });
};

//vérifie si user connecté
export const me = (req, res) => {
    const token = req.cookies.token; //récupère le cookie
    if(!token) return res.status(200).json({authenticated: false});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //vérifie token valide

        return res.status(200).json({
            authenticated: true,
            userId: decoded.userId,
            role: decoded.role
        });
    } catch(error) {
        return res.status(200).json({authenticated: false});
    }
};
