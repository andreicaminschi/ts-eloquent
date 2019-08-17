import Model from "../../eloquent/database/Model";
import UserFactory from "@/database/factories/UserFactory";
import TokenRepository from "@/database/repositories/TokenRepository";
import TokenFactory from "@/database/factories/TokenFactory";

export default class TokenModel extends Model {
    public GetModelName(): string {return "token";}
    public GetFactory(): UserFactory {return new UserFactory() }
    public GetRepository(): TokenRepository { return new TokenRepository(new TokenFactory());}

}