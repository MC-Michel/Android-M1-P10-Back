const admin = require('firebase-admin');
const serviceAccount = require('./../../../mada-fce24-firebase-adminsdk-99k9c-4cf028c4d8.json');
const topic = "all_users_topic";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Autres options de configuration si nécessaire
});

module.exports = class FirebaseService{
    static pushNotification(notification){
        return admin.messaging().sendToTopic(topic, {
            notification: notification,
        });
    }
    
    static subscribeToDefaultTopic(token){
        return admin.messaging().subscribeToTopic(token, topic);
    }

    static unsubscribeToDefaultTopic(token){
        return admin.messaging().unsubscribeFromTopic(token, topic);
    }
}