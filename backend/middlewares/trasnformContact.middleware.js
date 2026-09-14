export const transformContact = (req, res, next) => {
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

    if (typeof req.body.message === "string") {
        req.body.message = req.body.message.trim();
    }

    next();
};