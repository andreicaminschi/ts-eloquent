import Model from "@/eloquent/database/Model";
import Repository from "@/eloquent/database/Repository";

export default class MorphManyRelation<SOURCE extends Model, RELATED extends Model> {
    public $is_morph_many_relation: boolean = true;
    private source: SOURCE;
    private related: RELATED;
    private repository: Repository<Model>;
    get RelationName() {return this.related.GetModelName() + 's'}

    private local_key: string;
    private foreign_key: string;
    private type: string;
    public get Repository() {return this.repository;}

    constructor(params: { source: SOURCE, related: RELATED, morph_type: string, local_key?: string, foreign_key?: string }) {
        this.source = params.source;
        this.related = params.related;
        this.type = params.morph_type;
        this.repository = new Repository(this.related.GetFactory());

        this.local_key = params.local_key || 'id';
        this.foreign_key = params.foreign_key || `attachable_id`;
    }

    public async Get() {
        if (!this.Repository.IsNew()) return this.Repository;
        await this.Repository.WhereEquals('type', this.type)
            .WhereEquals(this.foreign_key, this.source.GetPropertyValue(this.local_key.snakeCaseToCamelCase()))
            .Get()

        return this.repository;
    }

    public async Refresh() {
        await this.Repository.WhereEquals('type', this.type)
            .WhereEquals(this.foreign_key, this.source.GetPropertyValue(this.local_key.snakeCaseToCamelCase()))
            .Get();
        return this.repository;
    }

}