const GenRepository = require("../commons/database/class/gen-repository");
const { addDays } = require("../commons/functions/gen-date");
const CustomError = require("../errors/custom-error")
const md5 = require("md5");
const User = require("../models/user.model");
const TokenRepository = require("../repositories/token.repo");

const userRepository = new GenRepository(User)
const tokenRepository = new TokenRepository;
module.exports = class UserService {
    static async findUserByValidToken(token){
        return await tokenRepository.findUser(token);
    }
    static async findUserByEmailAndPassword(data){
        const users = await userRepository.find({
            excludeFields: ['password'],
            filter: [
                {
                    column: 'email',
                    type: 'string',
                    value: data.email,
                    comparator: '='
                },
                {
                    column: 'password',
                    type: 'string',
                    value: md5(data.password),
                    comparator: '='
                },
            ]
        }) 
        if(users.data.length  === 0) return null;
        return users.data[0];
    }
   
    static async createToken(user){
        const creationDate = new Date()
        const token = {
            token: UserService.generateTokenStr(user),
            userId: user._id,
            createdAt: creationDate,
            expiresAt: addDays(creationDate, 1)
        }
        await tokenRepository.insert([token]);
        return token.token
    }

    //TODO: Generate a real token
    static generateTokenStr(user){
        return md5(new Date().toString()+user._id);
    }

    static buildSigninMail(newUser){
        let societyName = "Zahao";
        let mail = {
            to: newUser.email,
            subject: `Bienvenue chez ${societyName}`,
            html: `
                <p>Cher ${newUser.firstName},</p>

                <p>Nous sommes ravis de vous accueillir dans notre communauté d'explorateurs passionnés de Madagascar ! En tant que partenaire de voyage, nous sommes enchantés de vous offrir une expérience inoubliable pour découvrir les trésors cachés et les merveilles de cette île enchanteresse.</p>
                
                <p>Notre application mobile a été spécialement conçue pour vous aider à tirer le meilleur parti de votre voyage à Madagascar. Que vous soyez un aventurier en quête de nouvelles découvertes, un amoureux de la nature en quête de panoramas à couper le souffle, ou un curieux désireux d'explorer les richesses culturelles de cette destination unique, notre application est votre guide ultime.</p>
                
                <p>Encore une fois, bienvenue chez ${societyName} et nous espérons vous voir bientôt.</p>
                
                <p>Cordialement,</p>
                <p>${societyName}</p>
            `
        };
        return mail;
    }


}