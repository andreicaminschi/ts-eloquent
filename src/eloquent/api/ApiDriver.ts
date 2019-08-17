import axios from 'axios';
import {IApiDriver} from "@/eloquent/api/IApiDriver";
import {ApiResponse} from "@/eloquent/api/ApiResponse";


export class ApiDriver implements IApiDriver {
    private token: string = '';
    public SetToken(token: string): this {
        this.token = token;
        return this;
    }

    RemoveToken(): this {
        this.token = '';
        return this;
    }


    private base_endpoint: string = '';
    public SetBaseEndpoint(uri: string): this {
        this.base_endpoint = uri;
        return this;
    }

    private version: string = '';
    public SetVersion(version: string) {
        this.version = version;
        return this;
    }

    constructor(base_endpoint: string, version: string) {
        this.SetBaseEndpoint(base_endpoint)
            .SetVersion(version);
    }

    private get EndpointRoot(): string {return [this.base_endpoint, this.version].join('/');}

    private GetEndpointUrl(endpoint: string) {return [this.EndpointRoot, endpoint].join('/');}

    public Get(endpoint: string, data?: Dictionary<any>) {
        return axios.get(this.GetEndpointUrl(endpoint), {params: data})
            .then((r: Dictionary<any>) => {
                return new ApiResponse(r);
            })
    }

    public Post(endpoint: string, data?: Dictionary<any>) {
        return axios.post(this.GetEndpointUrl(endpoint), data)
            .then((r: Dictionary<any>) => {
                return new ApiResponse(r);
            })
    }

    public Patch(endpoint: string, data?: Dictionary<any>) {
        return axios.patch(this.GetEndpointUrl(endpoint), data)
            .then((r: Dictionary<any>) => {
                return new ApiResponse(r);
            })
    }
}
