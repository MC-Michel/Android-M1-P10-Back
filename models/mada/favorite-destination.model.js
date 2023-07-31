const {body} = require('express-validator'); 

const _id = {
    type: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class FavoriteDestination {
    static schema ={
        "destinationId": { type: 'string', validatorGetter: (paramPropertyName='destinationId')=> body(paramPropertyName).isString().withMessage("Destination id invalide")  },
        "userId": { type: 'string', validatorGetter: (paramPropertyName='userId')=> body(paramPropertyName).isString().withMessage("User id invalide")  },
    }
    static createSchemaDto = (()=> { 
        const ans = {...this.schema};  
        delete ans.userId;
        return ans;}) ();
    static deleteSchemaDto = (()=> { 
        const ans = {...this.schema};  
        delete ans.userId;
        return ans;}) ();
    static updateSchemaDto =  (()=> { 
        const ans = {...this.schema, _id}; 
        return ans;}) ();
    static collection = "FavoriteDestination";
}

module.exports = FavoriteDestination;