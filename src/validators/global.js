import { param } from "express-validator";
import { validateResults } from "../utils/handleValidator.js";

export const validateNeedsId = [
    param("id", "Id é obrigatório")
        .exists()
        .notEmpty()
        .withMessage("Id não pode ser vazio")
        .isMongoId()
        .withMessage("Formato de Id inválido"),
    (req, res, next) => {
        validateResults(req, res, next);
    }
];