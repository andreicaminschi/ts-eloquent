import Factory from "@/eloquent/database/Factory";
import UserModel from "@/database/models/UserModel";
import LocationModel from "@/database/models/LocationModel";

export default class LocationFactory extends Factory<LocationModel> {
    Make(data?: Dictionary<any>): LocationModel {return new LocationModel(data);}

}