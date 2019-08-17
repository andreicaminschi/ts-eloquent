export interface IApiResponse {
    IsSuccessful(): boolean;

    HasData(key: string): boolean;

    GetData(key: string): any;

    GetError(): string;
}
