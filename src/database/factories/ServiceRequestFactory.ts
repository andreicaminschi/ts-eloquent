import Factory from "@/eloquent/database/Factory";
import ServiceRequestModel from "@/database/models/ServiceRequestModel";

export default class ServiceRequestFactory extends Factory<ServiceRequestModel> {
    Make(data?: Dictionary<any>): ServiceRequestModel {return new ServiceRequestModel(data);}

}