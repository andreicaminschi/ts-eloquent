import Model from "../../eloquent/database/Model";
import LocationFactory from "@/database/factories/LocationFactory";
import LocationRepository from "@/database/repositories/LocationRepository";

export default class LocationModel extends Model {
    public GetModelName(): string { return "location"; }
    public GetFactory(): LocationFactory { return new LocationFactory();}
    public GetRepository(): LocationRepository { return new LocationRepository(new LocationFactory); }

    public Id: number = 0;
    public Name: string = '';

    constructor(data?: Dictionary<any> | number) {
        super(data);
        if (data) this.Load(data);
    }
}