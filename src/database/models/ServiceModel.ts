import ServiceFactory from "@/database/factories/ServiceFactory";
import ServiceRepository from "@/database/repositories/ServiceRepository";
import LocationModel from "@/database/models/LocationModel";
import Model from "@/eloquent/database/Model";
import {ModelDecorator} from "@/eloquent/decorators/ModelDecorator";
import BelongsToRelation from "@/eloquent/database/relations/BelongsToRelation";

@ModelDecorator
export default class ServiceModel extends Model {
    GetModelName(): string {return "service";}
    GetFactory(): ServiceFactory { return new ServiceFactory() }
    GetRepository(): ServiceRepository { return new ServiceRepository(new ServiceFactory);}

    public Id: number = 0;
    public LocationId: number = 0;
    public Location: BelongsToRelation<this, LocationModel> = new BelongsToRelation<this, LocationModel>({source: this, related: new LocationModel()});


    constructor(data?: Dictionary<any> | number) {
        super(data);
        if (data) this.Load(data);
    }
}