var express = require('express'); 
const createRouteCallback = require('../../../commons/functions/create-route-callback');
const FirebaseService = require('../../../services/mada/external/firebase.service');
var router = express.Router();

const subscribeToDefaultTopic = async function(req, res) {
    const token = req.body.token;
    console.log(token);
    await FirebaseService.subscribeToDefaultTopic(token);
    res.json({message: "Destination created"});
}


//Firebase endpoints
router.post('/subscribe-to-default-topic', createRouteCallback(subscribeToDefaultTopic));

module.exports = router;