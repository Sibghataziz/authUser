import bcrypt from "bcrypt";
import { ITokenUser, IUser } from "./model/constant";
const jwt = require('jsonwebtoken')
const crypto = require('crypto-js')

async function hashPassword(plainPassword: string) {
  const saltRounds = +process.env.PASSWORD_SALT;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

async function comparePassword(plainPassword: string, hashedPassword: string) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

function generateCustomToken(data: ITokenUser) {
    const token = jwt.sign(data, process.env.JWT_SECRET);
    const encryptedToken = crypto.AES.encrypt(token, process.env.CRYPTO_SECRET).toString();
    return encryptedToken
}

function decryptCustomToken(token: string){
    const decryptedToken  = crypto.AES.decrypt(token, process.env.CRYPTO_SECRET);
    const originalEncryptedString = decryptedToken.toString(crypto.enc.Utf8);
    var decodedToken: ITokenUser = jwt.verify(originalEncryptedString, process.env.JWT_SECRET);
    return decodedToken
}

function getTokenUserData(user: IUser){
    return <ITokenUser>{
        _id: user._id ?? "",
        email: user.email,
        isAdmin: user.isAdmin,
        isPrivate: user.isPrivate,
        phone: user.phone
    } 
}


export default {
    hashPassword,
    comparePassword,
    generateCustomToken,
    decryptCustomToken,
    getTokenUserData
}
