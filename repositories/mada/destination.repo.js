 
 
 
const { ObjectID } = require("bson");
const GenRepository = require("../../commons/database/class/gen-repository");
const { formatAndTrunc } = require("../../commons/functions/gen-date");
const { getConnection } = require("../../configs/db");
const Destination = require("../../models/mada/destination.model");
const Constant = require("../../models/constant.model");
const FavoriteDestination = require("../../models/mada/favorite-destination.model");
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
    
    async findWithFavoriteStatus(params, userId){
        const collection = this.getCollection();
        const filters = this.createMatchOptions(params.filter, params.filterMode);
        const paginationAggregates = this.createPaginationAggregates(params.pagination);
        
        const projectAggregate = {favorites: 0};
        params.excludeFields?.map(fieldToExclude => projectAggregate[fieldToExclude] = 0)
         

        const aggregates = [
            {
                $lookup: {
                    from: FavoriteDestination.collection,
                    localField: "_id",
                    foreignField: "destinationId",
                    as: "favorites"
                }
            },
            {
                $addFields: {
                    "isFavorite": {
                        $in: [ObjectID(userId), "$favorites.userId"]
                    }
                }
            },
            {
                $project: projectAggregate
            },
            {
                $match: filters
            },
           
        ];
      
      
        const results = {
            data: await collection.aggregate([...aggregates, ...paginationAggregates]).toArray(),
            meta: {
                totalElmtCount: await this.getTotalElmtCount( aggregates)
            }
        }
       
        return results;
    }
}