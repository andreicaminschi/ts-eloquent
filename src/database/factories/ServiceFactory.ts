import Factory from "@/eloquent/database/Factory";
import ServiceModel from "@/database/models/ServiceModel";

export default class ServiceFactory extends Factory<ServiceModel> {
    Make(data?: Dictionary<any>): ServiceModel {return new ServiceModel(data);}

}