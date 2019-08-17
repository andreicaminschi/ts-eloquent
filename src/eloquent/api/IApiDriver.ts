import {IApiResponse} from "@/eloquent/api/IApiResponse";

export interface IApiDriver {
    SetToken(token: string): this;

    RemoveToken(): this;

    Get(endpoint: string, data?: Dictionary<any>): Promise<IApiResponse>;
    Post(endpoint: string, data?: Dictionary<any>): Promise<IApiResponse>;
    Patch(endpoint: string, data?: Dictionary<any>): Promise<IApiResponse>;
}
