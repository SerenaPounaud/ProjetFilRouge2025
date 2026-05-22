import User from "../models/user.models.js";

//get test
export const getHello = (req, res) => {
    res.json({message: "Hello from Express"})
}