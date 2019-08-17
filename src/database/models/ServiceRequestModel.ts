import Model from "@/eloquent/database/Model";
import ServiceRequestFactory from "@/database/factories/ServiceRequestFactory";
import ServiceRequestRepository from "@/database/repositories/ServiceRequestRepository";

export default class ServiceRequestModel extends Model {
    GetModelName(): string {return "service-request";}
    GetFactory(): ServiceRequestFactory { return new ServiceRequestFactory() }
    GetRepository(): ServiceRequestRepository { return new ServiceRequestRepository(new ServiceRequestFactory);}

    public Id: number = 0;
    public Details: string = '';
    constructor(data?: Dictionary<any> | number) {
        super(data);
        if (data) this.Load(data);
    }
}