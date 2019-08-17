import Factory from "@/eloquent/database/Factory";
import HasOneRelation from "@/eloquent/database/relations/HasOneRelation";
import Repository from "@/eloquent/database/Repository";
import {IApiDriver} from "@/eloquent/api/IApiDriver";
import {IApiResponse} from "@/eloquent/api/IApiResponse";
import BelongsToRelation from "@/eloquent/database/relations/BelongsToRelation";

export default abstract class Model {
    [key: string]: any;

    public $is_model = true;

    public abstract GetFactory(): Factory<Model>;
    public abstract GetRepository(): Repository<Model>;

    public static ApiDriver: IApiDriver;
    public static SetApiDriver(apiDriver: IApiDriver) {
        Model.ApiDriver = apiDriver;
    }

    /**
     * Gets the api driver.
     * @constructor
     */
    public GetApiDriver(): IApiDriver {
        return Model.ApiDriver;
    }
    /**
     * Gets the model name.
     * The model name is used to automatically load data when an api response with that key is received ( eg: Save )
     * @constructor
     */
    public abstract GetModelName(): string;
    public GetCreateUrl(): string { return this.GetModelName(); }
    public GetEditUrl(): string { return [this.GetModelName(), '{Id}'].join('/')}


    private $is_new: boolean = true;
    /**
     * Determines if the model instance is new.
     * @constructor
     */
    public IsNew() { return this.$is_new; }


    constructor(data?: Dictionary<any> | number) {
        if (data) this.Load(data);
    }

    public Load(data: Dictionary<any> | number) {
        this.$is_new = false;
        if (typeof data === 'number') {
            this.SetPropertyValue('Id', data);
            return;
        }

        let passed_value: any;
        let property_value: any;

        Object.keys(data).forEach((key: string) => {
            passed_value = data[key];
            key = key.snakeCaseToCamelCase();
            property_value = this.GetPropertyValue(key);

            if (Object.isHasOneRelation(property_value)) {
                (<HasOneRelation<this, Model>>property_value).Model.Load(passed_value);
                return;
            } else if (Object.isBelongsToRelation(property_value)) {
                (<BelongsToRelation<this, Model>>property_value).Model.Load(passed_value);
                return;
            }

            this.SetPropertyValue(key, passed_value);
        });

        this.LoadOriginalAttributes();
    }

    //region Properties
    public GetPropertyValue(key: string) { return this[key]; }
    public SetPropertyValue(key: string, value: any) {
        this[key] = value;
        return this;
    }

    private $originalAttributes: Dictionary<any> = {};
    /**
     * Gets model property names.
     * Fields that start with a dollar sign are ignored
     * @constructor
     */
    private GetOwnPropertyNames() { return Object.keys(this).filter((key: string) => { return key.indexOf("$") !== 0 }); }

    /**
     * Saves the values of the attributes.
     * Used to determine which values have changed
     * @constructor
     */
    private LoadOriginalAttributes() {
        this.$originalAttributes = {};
        this.GetOwnPropertyNames().forEach((key: string) => {
            this.$originalAttributes[key] = this[key];
        })
    }

    /**
     * Determines if an attribute has been changed
     * @param key
     * @constructor
     */
    private HasAttributeChanged(key: string) {return this[key] !== this.$originalAttributes[key]}

    private GetChangedAttributes(params: { convert_to_snake_case: boolean } = {convert_to_snake_case: true}): Dictionary<any> {
        let changed: Dictionary<any> = {};
        this.GetOwnPropertyNames().forEach((key: string) => {
            if (this.HasAttributeChanged(key)) changed[params.convert_to_snake_case ? key.camelCaseToSnakeCase() : key] = this[key];
        });
        return changed;

    }
    //endregion


    /**
     * Retrieves data from the database
     * @constructor
     */
    public async Get(): Promise<IApiResponse> {
        return await this.GetApiDriver().Get(this.GetEditUrl().replaceWithObjectProperties(this))
            .then((r: IApiResponse) => {
                this.Load(r.GetData(this.GetModelName()));
                return r;
            });
    }

    /**
     * Saves the model to the database.
     * @constructor
     */
    public async Save() {
        let url = this.GetEditUrl().replaceWithObjectProperties(this);
        return this.IsNew()
            ? this.GetApiDriver().Patch(url, this.GetChangedAttributes())
            : this.GetApiDriver().Post(url, this.GetChangedAttributes());

    }
}