var express = require('express'); 
const createRouteCallback = require('../../../commons/functions/create-route-callback');
const FirebaseService = require('../../../services/mada/external/firebase.service');
var router = express.Router();

const subscribeToDefaultTopic = async function(req, res) {
    const token = req.body.token;
    await FirebaseService.subscribeToDefaultTopic(token);
    res.json({message: "Subscription created"});
}

const unsubscribeToDefaultTopic = async function(req, res) {
    const token = req.body.token;
    await FirebaseService.unsubscribeToDefaultTopic(token);
    res.json({message: "Unsubscribed successfully"});
}


//Firebase endpoints
router.post('/subscribe-to-default-topic', createRouteCallback(subscribeToDefaultTopic));
router.post('/unsubscribe-to-default-topic', createRouteCallback(unsubscribeToDefaultTopic));

module.exports = router;