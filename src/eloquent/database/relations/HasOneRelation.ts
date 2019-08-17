import Model from "@/eloquent/database/Model";
import Repository from "@/eloquent/database/Repository";
import {IApiResponse} from "@/eloquent/api/IApiResponse";

export default class HasOneRelation<SOURCE extends Model, RELATED extends Model> {
    public $is_has_one_relation: boolean = true;
    private source: SOURCE;
    private related: RELATED;

    private local_key: string;
    private foreign_key: string;
    get Model() {return this.related;}
    private repository: Repository<Model>;
    constructor(params: { source: SOURCE, related: RELATED, local_key?: string, foreign_key?: string }) {
        this.source = params.source;
        this.related = params.related;

        this.local_key = params.local_key || 'id';
        this.foreign_key = params.foreign_key || `${this.source.GetModelName()}_id`;
        this.repository = this.related.GetRepository();
    }


    public async Get(): Promise<IApiResponse> {
        return this.repository.Where(this.foreign_key, '=', this.source[this.local_key.snakeCaseToCamelCase()]).Get();
    }
}