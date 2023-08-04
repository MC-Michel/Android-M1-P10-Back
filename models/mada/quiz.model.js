const {body} = require('express-validator');  
const QuizQuestion = require('./quiz-question.model');

const _id = {
    tyep: 'string',
    validatorGetter: (paramPropertyName='_id')=> body(paramPropertyName).isString().withMessage('Identifiant invalide') 
}
class Quiz {
    static schema ={
        "video": {
            type: 'string'
        },
        "title": { type: 'string', validatorGetter: (paramPropertyName='title')=> body(paramPropertyName).isString().withMessage("Titre invalide")  },
        "description": { type: 'string', validatorGetter: (paramPropertyName='description')=> body(paramPropertyName).isString().withMessage("Description invalide").customSanitizer(elmt => elmt.replaceAll(' ', ''))  },
        "questions": { classConstructor: QuizQuestion},
    }
    
    static collection = "Quiz";
}

module.exports = Quiz;