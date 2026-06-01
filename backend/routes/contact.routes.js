import express from "express";
import { validateContact } from "../middlewares/contact.validation.js";
import { sendMessage } from "../controllers/contact.controller.js";
import { transformContact } from "../middlewares/trasnformContact.middleware.js";

const router = express.Router();

router.post("/", transformContact, validateContact, sendMessage);

export default router;