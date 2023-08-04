
const carsRoutes = require('./routes/cars')
const defaultRepairsRoutes = require('./routes/default-repairs')
const repairsHistoricRoutes = require('./routes/repairs-historic')
const rapairsRoutes = require('./routes/repairs')
const expensesRoutes = require('./routes/expenses')
const usersRoutes = require('./routes/users')
const statsRoutes = require('./routes/stats');
const quizRoutes = require('./routes/mada/quiz')
// Mada
const destinationsRoutes = require('./routes/mada/destinations');
const firebaseRoutes = require('./routes/mada/external/firebase');

module.exports = function (app){
    app.use("/cars", carsRoutes);
    app.use("/default-repairs", defaultRepairsRoutes);
    app.use("/repairs-historic", repairsHistoricRoutes);
    app.use("/repairs", rapairsRoutes);
    app.use("/expenses", expensesRoutes);
    app.use("/stats", statsRoutes);

    // Routes for mada's project
    app.use("/destination", destinationsRoutes);
    app.use("/firebase", firebaseRoutes);
    app.use("/quiz", quizRoutes);
    app.use("/users", usersRoutes);
}