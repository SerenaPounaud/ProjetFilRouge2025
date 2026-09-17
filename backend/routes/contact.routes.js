import express from "express";
import { validateContact } from "../middlewares/contact.validation.js";
import { sendMessage } from "../controllers/contact.controller.js";
import { transformContact } from "../middlewares/transformContact.middleware.js";
import { sanitizeBody } from "../middlewares/sanitizeBody.middleware.js";

const router = express.Router();

router.post("/", sanitizeBody(["lastname", "firstname", "email", "message", "rgpd"]), transformContact, validateContact, sendMessage);

export default router;