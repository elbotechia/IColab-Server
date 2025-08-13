import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { handleHttpError } from '../errors/handleError.js';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_KEY

export const tokenSignIn = async ({userObj})=>{
    try {
        const sign = jwt.sign({
            id: userObj.id,
            username: userObj.username,
            email: userObj.email,
            role: userObj.role,
            permissions: userObj.permissions,
        }, JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        })

        return sign

        
    } catch (error) {
        throw new Error("ERROR_SIGN_IN_TOKEN");
    }
}


export const tokenVerify = async (token) => {
    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}