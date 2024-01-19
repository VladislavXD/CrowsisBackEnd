import Express from "express";
import mongoose from "mongoose";
import { registerValidation } from './validations/auth.js';
import chekAuth from './utils/chekAuth.js'
import { LoginValidation } from "./validations/login.js";

import * as UserController from './controllers/UserController.js'

import cors from 'cors';

mongoose.connect(
    'mongodb+srv://Crowsistest:crowsis123@cluster0.6vpgtwr.mongodb.net/blog?retryWrites=true&w=majority',
    )
    .then(() => { console.log(('DB OK')) })
    .catch((err) => { console.log(`DB ERROR ${err}`) });
const app = Express();
app.use(cors());
app.use(Express.json());



  

//Autoresation
app.post('/auth/login', LoginValidation, UserController.login);
//Registration
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', chekAuth, UserController.getMe)







app.listen(process.env.PORT || 5050, (err) => {
    if (err) {
        return console.log(`Error ${err}`);
    }

    console.log("Server OK");
})


