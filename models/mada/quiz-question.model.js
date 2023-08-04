const {body} = require('express-validator');  

const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class QuizQuestion {
    static schema ={
        "question": {
            type: 'string'
        },
        "options": {type: "array"},
        "rightAnswer": { type: 'int' }, 
    }
    
    static collection = "QuizQuestion";
}

module.exports = QuizQuestion;