var express = require('express'); 
const GenRepository = require('../../commons/database/class/gen-repository');
const createRouteCallback = require('../../commons/functions/create-route-callback');
const { getConnection } = require('../../configs/db');
const createBodySchemaParser = require('../../middlewares/body-schema-parser');
const Destination = require('../../models/mada/destination.model');
const {assign} = require('../../commons/database/methods/gen-reflect');
const { ObjectID, ObjectId } = require('bson');
const Constant = require('../../models/constant.model');
const DestinationService = require('../../services/mada/destination.service');
const CustomError = require('../../errors/custom-error');
const createAuth = require('../../middlewares/auth');
const DestinationRepository = require('../../repositories/mada/destination.repo');
const { findCoreDestinationById } = require('../../services/mada/destination.service');
const { destinationStatus } = require('../../models/constant.model');
const FirebaseService = require('../../services/mada/external/firebase.service');
const FavoriteDestination = require('../../models/mada/favorite-destination.model');
var router = express.Router();

const repository = new DestinationRepository();

const getListForVisitor = async function(req, res) {  
  const params = req.query;
  const currentUser = req.currentUser;
  
  const data = currentUser ?
    await DestinationService.findConnectedUsersDestinations(currentUser._id.toString(), params):
    await DestinationService.findCoreDestinations(params);
  
  res.json(data);
};
 
const getListForAdmin = async function(req, res) {  
  const data = await DestinationService.findCoreDestinations(req.query);
  res.json(data);
};

const createFavorite = async function (req, res) {
  const currentUser = req.currentUser;
  req.body.userId = currentUser._id;
  res.json(await DestinationService.addFavorite(req.body));
}
const deleteFavorite = async function(req,res){
  const currentUser = req.currentUser;
  res.json(await DestinationService.removeFavorite(req.params.destinationId, currentUser._id));
}


const insertDestination = async function(req, res) {
  const body = assign(Destination, req.body, 'createSchemaDto');
  body.status = Constant.destinationStatus.created;
  body.registrationDate = new Date();
  await repository.insert([body]);
  // Notification
  const nofitification = {
    title: 'Destination créée',
    body: "Une destination vient d'être ajoutée sur l'application! Soyez le premier à le visiter sur votre application!",
  }
  await FirebaseService.pushNotification(nofitification);
  res.json({message: "Destination created"});
}
const updateDestination = async function(req, res) {
  const destination = await DestinationService.findCoreDestinationById(req.body._id, {currentUser: req.currentUser, exists: true});
  const body = assign(Destination, req.body, 'updateSchemaDto');
  await repository.update(body);
  res.json({message: "Destination updated"});
}

const deleteDestinationVisitor = async function (req, res) {
  const destination = await DestinationService.findCoreDestinationById(req.params.id, {currentUser: req.currentUser, exists: true});
  await repository.softDelete(req.params.id);
  res.json({message: "Destination retirée"});
}

const getById = async function (req, res){
  const destination = req.currentUser ?
  await DestinationService.findConnectedUsersDestinationsById(req.currentUser._id.toString(), req.params.id, {exists: true}):
  await DestinationService.findCoreDestinationById(req.params.id, {exists: true});
  ;
  res.json(destination);
}


//Visitor endpoints
router.get('/', createAuth([], true), createRouteCallback(getListForVisitor));

router.get('/:id', createAuth([], true),createRouteCallback(getById));
 
router.post('/favorites',createAuth([]), createBodySchemaParser(FavoriteDestination, 'createSchemaDto'), createRouteCallback(createFavorite));
router.delete('/favorites/:destinationId',createAuth([]), createRouteCallback(deleteFavorite));

router.post('', createBodySchemaParser(Destination), createRouteCallback(insertDestination));
router.patch('',createBodySchemaParser(Destination, 'updateSchemaDto'), createRouteCallback(updateDestination));
router.delete('/:id', createRouteCallback(deleteDestinationVisitor));


// router.delete('/visitor/:id', createAuth([1]), createRouteCallback(deleteDestinationVisitor));
// router.patch('/visitor',createAuth([1]),createBodySchemaParser(Destination, 'updateSchemaDto'), createRouteCallback(updateDestination));
// router.post('', createAuth([1]), createBodySchemaParser(Destination), createRouteCallback(insertDestination));
// router.get('/visitor/:id', createAuth([1]), createRouteCallback(getById));


//Admins endpoints
// router.get('/admin', createAuth([2,3]), createRouteCallback(getListForAdmin));

module.exports = router;