import mongoose from "mongoose";


const UserModel = new mongoose.Schema({
    fullName: {
        type: String, 
        require: true,
    },

    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },

    passwordHash: {
        type: String,
        require: true,
    },

    avatarUrl: String,
},
{
    timeseries: true,
},
);

export default mongoose.model('User', UserModel);