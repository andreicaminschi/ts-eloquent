import Model from "@/eloquent/database/Model";
import Repository from "@/eloquent/database/Repository";

export default class HasManyRelation<SOURCE extends Model, RELATED extends Model> {
    public $is_has_many_relation: boolean = true;
    private source: SOURCE;
    private related: RELATED;
    private repository: Repository<Model>;
    get RelationName() {return this.related.GetModelName() + 's'}

    private local_key: string;
    private foreign_key: string;
    public get Repository() {return this.repository;}

    constructor(params: { source: SOURCE, related: RELATED, local_key?: string, foreign_key?: string }) {
        this.source = params.source;
        this.related = params.related;
        this.repository = new Repository(this.related.GetFactory());

        this.local_key = params.local_key || 'id';
        this.foreign_key = params.foreign_key || this.source.GetModelName() + '_id';
    }

    public async Get() {
        if (!this.Repository.IsNew()) return this.Repository;
        await this.Repository.WhereEquals(this.foreign_key, this.source.GetPropertyValue(this.local_key.snakeCaseToCamelCase())).Get()
        return this.repository;
    }

    public async Refresh() {
        await this.Repository.WhereEquals(this.foreign_key, this.source.GetPropertyValue(this.local_key.snakeCaseToCamelCase())).Get()
        return this.repository;
    }

}