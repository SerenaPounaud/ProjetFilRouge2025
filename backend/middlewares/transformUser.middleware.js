export const transformUser = (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ message: "Body manquant" });
    }

    if (typeof req.body.lastname === "string") {
        req.body.lastname = req.body.lastname.trim();
    }

    if (typeof req.body.firstname === "string") {
        req.body.firstname = req.body.firstname.trim();
    }

    if (typeof req.body.email === "string") {
        req.body.email = req.body.email.trim().toLowerCase();
    }

    if (typeof req.body.password === "string") {
        req.body.password = req.body.password.trim();
    }

    next();
};
