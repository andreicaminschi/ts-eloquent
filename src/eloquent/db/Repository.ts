import Model from "@/eloquent/db/Model";
import {RECORD_INFO} from "@/eloquent/symbols";
import IDatabaseRecord from "@/eloquent/db/IDatabaseRecord";
import {IApiDriver} from "@/eloquent/api/IApiDriver";
import Eloquent from "@/eloquent/config";

export default class Repository<T extends Model> {
    public $is_repository: boolean = true;
    public Items: Dictionary<T> = {};

    //region Record info
    static [RECORD_INFO](): IDatabaseRecord<Model> { throw this.$table + ".[RECORD_INFO] must be implemented in the child class"; }
    [RECORD_INFO](): IDatabaseRecord<T> { throw this.$table + ".[RECORD_INFO] must be implemented in the child class"; }
    get RecordInfo() {return this[RECORD_INFO]();}
    static get RecordInfo() {return this[RECORD_INFO]();}

    get $table() {return this.RecordInfo.Table}
    static get $table() {return this.RecordInfo.Table}
    get $primary_key() {return this.RecordInfo.PrimaryKey}
    //endregion

    //region Connection
    /**
     * The connection to be used when saving or loading the model
     */
    protected $connection?: IApiDriver;
    /**
     * Gets the connection to be used when saving or loading the model.
     * If no connection is specified the default connection is used
     * @constructor
     */
    get Connection() { return this.$connection ? this.$connection : Eloquent.GetDefaultApiDriver()}
    //endregion

    //region Filters
    /**
     * Filters that don't change
     */
    public PersistentFilters: Dictionary<any> = {};

    /**
     * Filters, duh
     */
    public Filters: Dictionary<any> = {};

    /**
     * Resets the filters, but not the persistent filters
     * @constructor
     */
    public ResetFilters() {
        this.Filters = {};
        return this;
    }

    public Where(field: string, operator: string, value: any, is_fixed_filter: boolean = false) {
        let str = `${field}-${operator}`;
        if (value) is_fixed_filter ? this.PersistentFilters[str] = value : this.Filters[str] = value;
        return this;
    }

    public WhereEquals(field: string, value: any, is_fixed_filter: boolean = false) { return this.Where(field, 'EQ', value, is_fixed_filter) }
    public WhereNotEquals(field: string, value: any, is_fixed_filter: boolean = false) { return this.Where(field, 'NOTEQ', value, is_fixed_filter) }
    public WhereGreaterThan(field: string, value: any, is_fixed_filter: boolean = false) { return this.Where(field, 'GT', value, is_fixed_filter) }
    public WhereGreaterThanOrEquals(field: string, value: any, is_fixed_filter: boolean = false) { return this.Where(field, 'GTE', value, is_fixed_filter) }
    public WhereLessThan(field: string, value: any, is_fixed_filter: boolean = false) { return this.Where(field, 'LT', value, is_fixed_filter) }
    public WhereLessThanOrEquals(field: string, value: any, is_fixed_filter: boolean = false) { return this.Where(field, 'LTE', value, is_fixed_filter) }
    public WhereIsNull(field: string, is_fixed_filter: boolean = false) { return this.Where(field, 'ISNULL', 'null', is_fixed_filter) }
    public WhereIsNotNull(field: string, is_fixed_filter: boolean = false) { return this.Where(field, 'ISNOTNULL', 'null', is_fixed_filter) }
    public WhereBetween(field: string, value: any[], is_fixed_filter: boolean = false) { return this.Where(field, 'BETWEEN', value.join(','), is_fixed_filter) }
    public WhereNotBetween(field: string, value: any[], is_fixed_filter: boolean = false) { return this.Where(field, 'NOTBETWEEN', value.join(','), is_fixed_filter) }
    public WhereIn(field: string, value: any[], is_fixed_filter: boolean = false) { return this.Where(field, 'IN', value.join(','), is_fixed_filter) }
    public WhereNotIn(field: string, value: any[], is_fixed_filter: boolean = false) { return this.Where(field, 'NOTIN', value.join(','), is_fixed_filter) }
    public WhereStartsWith(field: string, value: string, is_fixed_filter: boolean = false) { return this.Where(field, 'STARTSWITH', value, is_fixed_filter) }
    public WhereEndsWith(field: string, value: string, is_fixed_filter: boolean = false) { return this.Where(field, 'ENDSWITH', value, is_fixed_filter) }
    public WhereContains(field: string, value: string, is_fixed_filter: boolean = false) { return this.Where(field, 'CONTAINS', value, is_fixed_filter) }

    public GetFilters(): Dictionary<any> {
        return {
            ...this.Filters,
            ...this.PersistentFilters
        }
    }
    //endregion

    constructor() {
    }

    //region Methods
    public async Get(append?: string) {
        let parts = [this.RecordInfo.Table];
        if (append) parts.push(append)
        let url = parts.join('/');

        let r = await this.Connection.Get(url, this.GetFilters());
        for (let row of r.GetData(this.$table)) {
            let model = this.RecordInfo.Make(row);
            this.Items = Object.assign({}, this.Items, {[model.GetAttribute(model.$primary_key)]: model});
        }
    }
    //endregion

}