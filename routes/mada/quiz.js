var express = require('express'); 
const GenRepository = require('../../commons/database/class/gen-repository');
const createRouteCallback = require('../../commons/functions/create-route-callback');
const Quiz = require('../../models/mada/quiz.model');
var router = express.Router();

const repository = new GenRepository(Quiz);

const getList  = async function(req, res) {  
 
  
  res.json( await repository.find({}));
};
  

 
router.get('/', createRouteCallback(getList));
 

module.exports = router;