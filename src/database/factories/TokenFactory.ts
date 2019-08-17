import Factory from "@/eloquent/database/Factory";
import TokenModel from "@/database/models/TokenModel";

export default class TokenFactory extends Factory<TokenModel> {
    Make(data?: Dictionary<any>): TokenModel {return new TokenModel(data);}

}