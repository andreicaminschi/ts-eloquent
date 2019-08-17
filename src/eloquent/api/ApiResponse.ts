import IApiResponse = API.IApiResponse;

export class ApiResponse implements IApiResponse {
    private readonly success: boolean;
    private readonly data: Dictionary<any>;
    private readonly error: Dictionary<any>;
    private readonly fieldErrors: Dictionary<any>;

    constructor(response: Dictionary<any>) {
        this.success = response.data.success || false;
        this.data = response.data.data || {};
        this.error = Object.createFromData(response.data.error || {});
        this.fieldErrors = Object.createFromData(response.data['field-errors'] || {});
    }

    IsSuccessful(): boolean { return this.success }
    GetData(key: string): any {return this.data[key] }
    GetError(): string { return this.error.Text;}
    HasData(key: string): boolean { return typeof this.data[key] !== "undefined"}
}
