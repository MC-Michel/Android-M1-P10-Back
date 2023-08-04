var express = require('express'); 
const GenRepository = require('../../commons/database/class/gen-repository');
const createRouteCallback = require('../../commons/functions/create-route-callback');
const Quiz = require('../../models/mada/quiz.model');
var router = express.Router();

const repository = new GenRepository(Quiz);

const getList  = async function(req, res) {   
  res.json( await repository.find({excludeFields: ['questions']}));
};
const getOne  = async function(req, res) {   
  res.json( await repository.findById(req.params.id));
};
  

 
router.get('/', createRouteCallback(getList));
router.get('/:id', createRouteCallback(getOne));

module.exports = router;