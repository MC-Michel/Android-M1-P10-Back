const {body} = require('express-validator'); 

const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class Destination {
    static schema ={
        "title": { type: 'string', validatorGetter: (paramPropertyName='title')=> body(paramPropertyName).isString().withMessage("Titre invalide")  },
        "description": { type: 'string', validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description invalide")  },
        "content": { type: 'string', validatorGetter: (paramPropertyName='content')=> body(paramPropertyName).isString().withMessage("Contenue invalide")  },
        "image": { type: 'string', validatorGetter: (paramPropertyName='image')=> body(paramPropertyName).isString().withMessage("Image invalide")  },
        "video": { type: 'string', validatorGetter: (paramPropertyName='video')=> body(paramPropertyName).isString().withMessage("Vidéo invalide")  },
        "localisation": { type: 'string', validatorGetter: (paramPropertyName='localisation')=> body(paramPropertyName).isString().withMessage("Localisation invalide")  },
        "status": { type: 'int',  validatorGetter: (paramPropertyName='status')=> body(paramPropertyName).isInt().withMessage("Statut invalide").toInt() },
        "registrationDate": { type: 'date', validatorGetter: (paramPropertyName='registrationDate')=> body(paramPropertyName).isISO8601().withMessage("Date d'enregistrement invalide").toDate() },
    }
    static createSchemaDto = (()=> { 
        const ans = {...this.schema}; 
        delete ans.status;
        delete ans.registrationDate;
        return ans;}) ();
    static updateSchemaDto =  (()=> { 
        const ans = {...this.schema, _id}; 
        delete ans.status;
        delete ans.registrationDate;
        return ans;}) ();
    static collection = "Destination";
}

module.exports = Destination;