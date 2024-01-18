import { body } from "express-validator";

export const LoginValidation = [
    body('email', "Не верный формат почты").isEmail(),
    body('password', "Пароль должен быть минимум 5 символов").isLength({min: 5}),
];