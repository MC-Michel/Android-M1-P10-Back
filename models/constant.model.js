const { body } = require("express-validator");

class Constant {
    static status = {
        deleted : -1,
        created : 0,
        validated : 1
    };
    // For mada's project
    static destinationStatus = {
        deleted : -1,
        created : 0,
        validated : 1
    };
    static roleID = {
        visitor : 1,
        admin : 2,
    }
}
module.exports = Constant;