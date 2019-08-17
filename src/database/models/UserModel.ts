import Model from "../../eloquent/database/Model";
import UserFactory from "@/database/factories/UserFactory";
import UserRepository from "@/database/repositories/UserRepository";
import TokenModel from "@/database/models/TokenModel";

export default class UserModel extends Model {
    public GetModelName(): string { return "user"; }
    public GetFactory(): UserFactory { return new UserFactory();}
    public GetRepository(): UserRepository { return new UserRepository(new UserFactory); }

    public Id: number = 0;
    public Token() {return this.HasOne(new TokenModel())}

    constructor(data?: Dictionary<any> | number) {
        super(data);
        if (data) this.Load(data);
    }
}