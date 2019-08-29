import {EloquentClass} from "@/eloquent/decorators";
import {IApiDriver} from "@/eloquent/api/IApiDriver";
import Eloquent from "@/eloquent/config";
import {group, group_collapsed, group_end, log} from "@/eloquent/log";
import IDatabaseRecord from "@/eloquent/db/IDatabaseRecord";
import {RECORD_INFO, RELATIONS} from "@/eloquent/symbols";
import Repository from "@/eloquent/db/Repository";

@EloquentClass
export default class Model {
    $is_model: boolean = true;
    $is_new: boolean = true;
    /**
     * Determines if the model is newly created.
     * @constructor
     */
    get IsNew() {return this.$is_new;}
    [key: string]: any;

    constructor(data?: Dictionary<any>) {
        if (data) this.Load(data);
        this.LoadOriginalAttributes();
    }
    /**
     * Creates a new instance
     * @constructor
     */

    //region Record info
    static [RECORD_INFO](): IDatabaseRecord<Model> { throw  this.$name + ".[RECORD_INFO] must be implemented in the child class"; }
    [RECORD_INFO](): IDatabaseRecord<Model> { throw this.$name + ".[RECORD_INFO] must be implemented in the child class"; }
    get RecordInfo() {return this[RECORD_INFO]();}
    static get RecordInfo() {return this[RECORD_INFO]();}

    get $name() {return this[RECORD_INFO]().Name}
    static get $name() {return this[RECORD_INFO]().Name}
    get $table() {return this[RECORD_INFO]().Table}
    get $primary_key() {return this[RECORD_INFO]().PrimaryKey}
    static Make() { return this[RECORD_INFO]().Make(); }
    //endregion

    // region RELATIONS
    protected relations: Dictionary<any> = {};
    public SetRelationValue(key: string, value: Model | Repository<Model>) { this.relations = Object.assign({}, this.relations, {[key]: value}); }
    public GetRelationValue(key: string) { return this.relations[key]; }
    static [RELATIONS](): Dictionary<any> { throw  this.$name + ".[RELATIONS] must be implemented in the child class"; }
    [RELATIONS](): Dictionary<any> { throw this.$name + ".[RELATIONS] must be implemented in the child class"; }
    get Relations() {return this[RELATIONS]();}
    static get Relations() {return this[RELATIONS]();}
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

    //region Original attributes
    /**
     * Original attributes
     * These are updated when the model is saved or loaded
     */
    private $original_attributes: Dictionary<any> = {};

    /**
     * Gets the original value of an attribute
     * Returns undefined if the attribute doesn't have an original value
     * @param key
     * @constructor
     */
    GetOriginalAttribute(key: string) {return this.$original_attributes[key];}

    /**
     * Sets the original value of an attribute
     * @param key
     * @param value
     * @constructor
     */
    private SetOriginalAttribute(key: string, value: any) {
        this.$original_attributes[key] = value;
        return this;
    }

    /**
     * Loads the original attributes
     * Loops though all the public properties of the class and saves the values
     * @constructor
     */
    LoadOriginalAttributes() {
        Object.keys(this).forEach((key: string) => this.SetOriginalAttribute(key, this.GetAttribute(key)))
        return this;
    }
    //endregion

    //region Attributes
    /**
     * Gets the value of an attribute
     * @param key
     * @constructor
     */
    GetAttribute(key: string) {return this[key]}

    /**
     * Sets the value of an attribute
     * @param key
     * @param value
     * @constructor
     */
    SetAttribute(key: string, value: any) {
        this[key] = value;
        return this;
    }

    /**
     * Loads the attributes from the given dictionary
     * The keys of the dictionary are transformed from snake_case to CamelCase
     * If the parameter is numeric then the primary key of the model is set to that value
     * @param data
     * @constructor
     */
    Load(data: Dictionary<any> | number) {
        group(`${this.$name}.Load()`);
        log('Relations', this.RecordInfo.Relations);
        log('Passed value', data);
        this.$is_new = false;
        if (typeof data === "number" || typeof data === 'string') {
            log(`Passed data is numeric or string, setting the primary key (${this.$primary_key}) to`, data);
            this.SetAttribute(this.$primary_key, data);
            group_end();
            return this;
        }

        let current_attribute_value: any,
            new_attribute_value: any;
        for (let key in data) {
            current_attribute_value = this.GetAttribute(key.snakeCaseToCamelCase());
            new_attribute_value = data[key];

            group_collapsed('Setting attribute ', key.snakeCaseToCamelCase());
            log('Current value ', typeof current_attribute_value === "function" ? 'FN' : current_attribute_value);
            log('New value ', typeof new_attribute_value === "function" ? 'FN' : new_attribute_value);

            if (Object.isModel(current_attribute_value)) {
                log('Current value is a model');
                (<Model>current_attribute_value).Load(new_attribute_value);
                group_end();
                continue;
            } else if (this.RecordInfo.Relations[key.snakeCaseToCamelCase()] === 'has-one') {
                log('Current value is a has-one-relation');
                this[key.snakeCaseToCamelCase()]().Load(new_attribute_value);
                group_end();
                continue;
            } else if (this.RecordInfo.Relations[key.snakeCaseToCamelCase()] === 'belongs-to') {
                log('Current value is a belongs-to-relation');
                this[key.snakeCaseToCamelCase()]().Load(new_attribute_value);
                group_end();
                continue;
            }

            this.LoadOriginalAttributes();
            group_end();

            this.SetAttribute(key.snakeCaseToCamelCase(), new_attribute_value);
        }
        group_end();
    }

    /**
     * Checks if an attribute is changed
     * @param key
     * @constructor
     */
    HasAttributeChanged(key: string) {return this.GetAttribute(key) != this.GetOriginalAttribute(key);}

    /**
     * Gets the attributes that are changed
     * @constructor
     */
    GetChangedAttributes() {
        let result: Dictionary<any> = {};
        Object.keys(this).forEach((key: string) => { if (this.HasAttributeChanged(key)) result[key] = this.GetAttribute(key); })
        return result;

    }
    //endregion

    //region Methods
    /**
     * Gets or refreshes the information of the model
     * @constructor
     */
    async Get() {
        let url = [this.$name, this.GetAttribute(this.$primary_key)].join('/');
        let r = await this.Connection.Get(url);
        this.Load(r.GetData(this.$name));
    }

    /**
     * Saves the model
     * @constructor
     */
    async Save() {
        let url = this.IsNew ? this.$name : [this.$name, this.GetAttribute(this.$primary_key)].join('/');
        let r = this.IsNew
            ? await this.Connection.Post(url, this.GetChangedAttributes())
            : await this.Connection.Patch(url, this.GetChangedAttributes());
        this.Load(r.GetData(this.$name));
    }
    //endregion


}