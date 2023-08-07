const GenRepository = require("../commons/database/class/gen-repository");
const CustomError = require("../errors/custom-error");
const Token = require("../models/token.model");

module.exports = class TokenRepository extends GenRepository{
    constructor(){
        super(Token)
    }
    async findUser(token, allowNullResult = false){
        const currentCollection = this.getCollection();
        const results = await currentCollection.aggregate([
            {
                $match: { token, $and: [{ expiresAt: {$gt: new Date()}}, { $or: [{destroyedAt: {$exists: false}}, {destroyedAt: null}] }] }
            },{
                $lookup:{
                    from: 'User',
                    localField: "userId",
                    foreignField: "_id",
                    as: 'user'
                }
            }
        ]).toArray();
        if(results.length === 0 && !allowNullResult) throw new CustomError("Token invalide");
        if(results.length === 0 ) return null;
        return results[0].user[0];
    }
    async destroyToken(token){
        const currentCollection = this.getCollection();
        await currentCollection.updateOne({token}, {$set: {destroyedAt: new Date()}})
    }
}


