import express from "express";
import { getCountries, getCities } from "../controllers/shipping_controller.js";

const router = express.Router();

router.get("/countries", getCountries);
router.get("/cities/:geonameId", getCities);

export default router;
