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
         const user = await User.findOne({email:email}).select("+password"); //récupère le mot de passe hashé
         if (!user) return res.status(401).json({message: "Email ou mot de passe incorrect"});

         //compare password
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) return res.status(401).json({message: "Email ou mot de passe incorrect"});

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
export const me = async (req, res, next) => {
    try {
        const token = req.cookies.token; //récupère le cookie
        if(!token) return res.status(401).json({authenticated: false});
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //vérifie token valide

        //récupère les infos du l'user dans mongodb
        const user = await User.findById(decoded.userId).select("lastname firstname email role");

        if(!user) {
            return res.status(404).json({message: "Utilisateur introuvable"});
        }

        return res.status(200).json({
            authenticated: true,
            user: {
                _id: user._id,
                lastname: user.lastname,
                firstname: user.firstname,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        if ( //token invalide ou token expiré
            error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({authenticated: false});
        }
        return next(error);
    }
    
};

//Modifier un profil
export const updateProfil = async (req, res, next) => {
    try {
        const {lastname, firstname, email, currentPassword, newPassword} = req.body;

        const user = await User.findById(req.userId).select("+password");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        //vérifie si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== user.email) {
            //l'id doit être différent de celui l'user actuel
            const existingUser = await User.findOne({email, _id: {$ne: user._id}}); //$ne = not equal
            if (existingUser) {
                return res.status(409).json({message: "Email déjà utilisé"});
            }
            user.email = email;
        }
        if (lastname) user.lastname = lastname;
        if (firstname) user.firstname = firstname;
        
        if (newPassword) {    
            //vérifie si le mot de passe actuel est correct    
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({message: "Le mot de passe actuel est incorrect"});
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }
       
        await user.save();
        return res.status(200).json({message: "Profil modifié avec succès", 
            user: {
            _id: user._id,
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            role: user.role
        }});

    } catch (error) {
        next(error);
    }
};
