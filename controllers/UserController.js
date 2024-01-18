import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from '../modals/user.js';

export const register =  async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }


        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Пользователь с таким адресом электронной почты уже зарегистрирован',
            });
        }


        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(password, salt);


        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: Hash,

        });

        const user = await doc.save();


        const token = jwt.sign(
            {
                _id: user._id,

            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );


        const { passwordHash, ...userData } = user._doc;

        res.json(
            {
                ...userData,
                token,
            }
        );
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось зарегестироваться',
        })
    }
}

export const login =  async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: "пользователь не найден",
            });
        }


        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'неверный логин или пароль',
            });
        }



        const token = jwt.sign(
            {
                _id: user._id,

            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );
        const { passwordHash, ...userData } = user._doc;

        res.json(
            {
                ...userData,
                token,
            }
        );


    } catch (err) { 
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка',
        })
    }
}

export const getMe =  async(req, res) => {

    try {
        const user = await UserModel.findById(req.userId);
        
        if (!user) {
            return res.status(402).json({
                message: 'пользователь не найден'
            })
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    }catch (err){
        console.log(err);
        res.status(400).json({
            message: 'нет доступа',
        });
    }
} 