const { ObjectID } = require("bson");
const GenRepository = require("../../commons/database/class/gen-repository");
const CustomError = require("../../errors/custom-error");
const Destination = require("../../models/mada/destination.model");

 
const repository = new GenRepository(Destination) 
module.exports = class DestinationService {
    static async findCoreDestinationById(_id, options = {}){
        const filter = [{
            column: '_id',
            type: 'string',
            value: ObjectID(_id),
            comparator: '='
        }];
        const excludeFields = [];
        const result = await repository.find({filter, excludeFields});
        if(result.data.length === 0) 
            if(options.exists) throw new CustomError('Aucune destination correspondante')    
            else return null;
        if(!options.alsoDeleted && result.data[0].deletedAt)
            throw new CustomError('La destination a déjà été supprimée');
        return result.data[0];
    }

    static async findCoreDestinations(params){
        if(!params.filter) params.filter = []
        params.excludeFields = ['content'] // We dont select the content when fetching list
        params.filter.push({
            column: 'deletedAt',
            type:'date',
            comparator: 'notExistsOrNull'
        });
        const result = await repository.find(params); 
        return result;
    }

   
    
}

     