export const transformContact = (req, res, next) => {
    const body = req.body;

    if (typeof body.lastname === 'string') {
        body.lastname = body.lastname.trim();
    }
    
    if (typeof body.firstname === 'string') {
        body.firstname = body.firstname.trim();
    }

    if (typeof body.email === 'string') {
        body.email = body.email.trim().toLowerCase();;
    }

    if (typeof body.message === 'string') {
        body.message = body.message.trim();
    }

    next();
};