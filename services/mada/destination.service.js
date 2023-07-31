const { ObjectID } = require("bson");
const GenRepository = require("../../commons/database/class/gen-repository");
const CustomError = require("../../errors/custom-error");
const Destination = require("../../models/mada/destination.model");
const DestinationRepository = require("../../repositories/mada/destination.repo");
const FavoriteDestination = require("../../models/mada/favorite-destination.model");

 
const repository = new DestinationRepository()
const favoritesRepository = new GenRepository(FavoriteDestination)

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
        console.log(params)
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

    static async findConnectedUsersDestinations(userId, params){
        if(!params.filter) params.filter = []
        params.excludeFields = ['content'] // We dont select the content when fetching list
        console.log(params)
        params.filter.push({
            column: 'deletedAt',
            type:'date',
            comparator: 'notExistsOrNull'
        }, 
        );
        const result = await repository.findWithFavoriteStatus(params, userId); 
        return result;
    }

    static async findConnectedUsersDestinationsById(userId, destinationId, options = {}){
        const params= {filter: [
            {
                column: 'deletedAt',
                type:'date',
                comparator: 'notExistsOrNull'
            },
            {
                column: '_id',
                type:'string',
                comparator: '=',
                value: new ObjectID(destinationId)
            },
        ]}
     
        
       
        const result = await repository.findWithFavoriteStatus(params, userId); 
        if(result.data.length === 0) {
            if(options.exists) throw new CustomError('Destination inexistante')
            return null;
        }
        return result.data[0];
    }
    
    static async  addFavorite(favorite){
        favorite.destinationId = new ObjectID(favorite.destinationId); 
        const existing = await favoritesRepository.find({filter: [
            {
                column: 'destinationId',
                value: favorite.destinationId ,
                type: 'string',
                comparator: '='
            }, 
            {
                column: 'userId',
                value: favorite.userId ,
                type: 'string',
                comparator: '='
            }
        ]})
        if(existing.data.length > 0) return {message: "already existing"};
        return await favoritesRepository.insert(favorite, "createSchemaDto")
    }

    static removeFavorite(destinationId, userId){
        return favoritesRepository.deleteByFilter({
            destinationId: ObjectID(destinationId),
            userId
        })
    }
}

     