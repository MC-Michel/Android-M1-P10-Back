
const usersRoutes = require('./routes/users')
const quizRoutes = require('./routes/mada/quiz')
// Mada
const destinationsRoutes = require('./routes/mada/destinations');
const firebaseRoutes = require('./routes/mada/external/firebase');

module.exports = function (app){

    // Routes for mada's project
    app.use("/destination", destinationsRoutes);
    app.use("/firebase", firebaseRoutes);
    app.use("/quiz", quizRoutes);
    app.use("/users", usersRoutes);
}