 
 
 
const { ObjectID } = require("bson");
const GenRepository = require("../../commons/database/class/gen-repository");
const { formatAndTrunc } = require("../../commons/functions/gen-date");
const { getConnection } = require("../../configs/db");
const Destination = require("../../models/mada/destination.model");
const Constant = require("../../models/constant.model");
const vars = {
    "year": {
        timePeriodFormat: "%Y-%m",
        timePeriodFormatForFilter: "%Y",
    },
    "month": {
        timePeriodFormat: "%Y-%m-%d",
        timePeriodFormatForFilter: "%Y-%m",
    }
}
module.exports = class DestinationRepository extends GenRepository {
    constructor(){
        super(Destination);
    }
}