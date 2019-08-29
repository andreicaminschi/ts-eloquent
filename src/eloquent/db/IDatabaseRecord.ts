import Model from "@/eloquent/db/Model";

export default interface IDatabaseRecord<T extends Model> {
    readonly Name: string;
    readonly Table: string;
    readonly PrimaryKey: string;
    readonly Relations: Dictionary<any>;

    // readonly Repository: IRepository<T>;

    Make(data?: Dictionary<any>): T;

}