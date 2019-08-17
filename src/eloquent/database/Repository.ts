import Model from "@/eloquent/database/Model";
import Factory from "@/eloquent/database/Factory";
import {IApiDriver} from "@/eloquent/api/IApiDriver";
import {List} from "@/eloquent/support/List";
import {IApiResponse} from "@/eloquent/api/IApiResponse";


export default class Repository<T extends Model> {
    private apiDriver: IApiDriver;

    public Items: List<T>;
    private factory: Factory<T>;
    get ResponseField() { return this.GetResponseField() || this.factory.Make().GetModelName() + 's';}
    get Url() { return this.GetEndpoint() || this.factory.Make().GetModelName() + 's';}

    constructor(factory: Factory<T>) {
        this.Items = new List<T>();
        this.factory = factory;

        this.apiDriver = this.factory.Make().GetApiDriver();
    }

    //region Filters
    public Filters: Dictionary<any> = {};

    public ResetFilters() {
        this.Filters.Empty();
        return this;
    }

    public Where(field: string, operator: string, value: any) {
        if (value) this.Filters[`${field}-${operator}`] = value;
        return this;
    }
    public WhereEquals(field: string, value: any) {
        if (value) this.Filters[field] = value;
        return this;
    }

    public WhereNotEquals(field: string, value: any) {
        if (value) this.Filters[`${field}-NOTEQ`] = value;
        return this;
    }

    public WhereGreaterThan(field: string, value: any) {
        if (value) this.Filters[`${field}-GT`] = value;
        return this;
    }

    public WhereGreaterThanOrEquals(field: string, value: any) {
        if (value) this.Filters[`${field}-GTE`] = value;
        return this;
    }

    public WhereLessThan(field: string, value: any) {
        if (value) this.Filters[`${field}-LTE`] = value;
        return this;
    }

    public WhereLessThanOrEquals(field: string, value: any) {
        if (value) this.Filters[`${field}-LTE`] = value;
        return this;
    }

    public WhereIsNull(field: string) {
        this.Filters[`${field}-ISNULL`] = 'null';
        return this;
    }

    public WhereIsNotNull(field: string) {
        this.Filters[`${field}-ISNOTNULL`] = 'null';
        return this;
    }

    public WhereBetween(field: string, value: any[]) {
        this.Filters[`${field}-BETWEEN`] = value.join(',');
        return this;
    }

    public WhereNotBetween(field: string, value: any[]) {
        this.Filters[`${field}-NOTBETWEEN`] = value.join(',');
        return this;
    }

    public WhereIn(field: string, value: any[]) {
        this.Filters[`${field}-IN`] = value.join(',');
        return this;
    }

    public WhereNotIn(field: string, value: any[]) {
        this.Filters[`${field}-NOTIN`] = value.join(',');
        return this;
    }

    public WhereStartsWith(field: string, value: string) {
        this.Filters[`${field}-STARTSWITH`] = value;
        return this;
    }

    public WhereEndsWith(field: string, value: string) {
        this.Filters[`${field}-ENDSWITH`] = value;
        return this;
    }

    public WhereContains(field: string, value: string) {
        this.Filters[`${field}-CONTAINS`] = value;
        return this;
    }
    //endregion

    public GetEndpoint() {return '';}
    public GetResponseField() {return '';}
    public async Get() {
        let instance = this.factory.Make();
        return this.apiDriver.Get(this.Url, this.Filters).then((r: IApiResponse) => {
            this.Load(r.GetData(this.ResponseField));
        });
    }

    public Add(item: T) {
        this.Items.Push(item);
        return this;
    }

    public AddFromData(data: Dictionary<any>) {
        this.Add(this.factory.Make(data));
        return this;
    }

    private $is_new: boolean = true;
    public IsNew() {return this.$is_new;}
    public Load(data: Dictionary<any>[]) {
        this.$is_new = false;
        this.Items.Empty();
        data.forEach((d: Dictionary<any>) => this.AddFromData(d));
        return this;
    }

}