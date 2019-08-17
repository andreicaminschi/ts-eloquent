import Model from "@/eloquent/database/Model";

export default class BelongsToRelation<SOURCE extends Model, RELATED extends Model> {
    public $is_belongs_to_relation: boolean = true;
    private source: SOURCE;
    private related: RELATED;

    private local_key: string;
    get LocalKey() {return this.local_key;}
    private foreign_key: string;
    get ForeignKey() {return this.foreign_key;}
    public get Model() {return this.related;}

    constructor(params: { source: SOURCE, related: RELATED, local_key?: string, foreign_key?: string }) {
        this.source = params.source;
        this.related = params.related;

        this.local_key = params.local_key || `${this.related.GetModelName()}_id`;
        this.foreign_key = params.foreign_key || `id`;
    }

    /**
     * Returns the model. If the model is already loaded the cached version will be returned
     * @constructor
     */
    public async Get(): Promise<RELATED> {
        if (!this.Model.IsNew()) return this.Model;
        await this.Model.SetPropertyValue('Id', this.source[this.local_key.snakeCaseToCamelCase()]).Get();
        return this.Model;
    }

    /**
     * Returns the latest version of the model from the database
     * @constructor
     */
    public async Refresh(): Promise<RELATED> {
        await this.Model.SetPropertyValue('Id', this.source[this.local_key.snakeCaseToCamelCase()]).Get();
        return this.Model;
    }
}