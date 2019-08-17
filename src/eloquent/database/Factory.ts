import Model from "@/eloquent/database/Model";

export default abstract class Factory<T extends Model> {
    public abstract Make(data?: Dictionary<any>): T;
}