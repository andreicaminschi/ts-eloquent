import Factory from "@/eloquent/database/Factory";
import UserModel from "@/database/models/UserModel";

export default class UserFactory extends Factory<UserModel> {
    Make(data?: Dictionary<any>): UserModel {return new UserModel(data);}

}