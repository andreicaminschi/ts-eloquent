import Model from "@/eloquent/db/Model";
import Repository from "@/eloquent/db/Repository";

export function EloquentClass<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            // hiding $
            Object.keys(this).forEach((key: string) => {
                if (key.indexOf('$') === 0) Object.defineProperty(this, key, {enumerable: false, configurable: false})
            })
        }
    }
}

function get_relation_value(instance: Model, relation: string) {
    return instance.Relations[relation];
}

function set_relation_value(instance: Model, relation: string, value: any) {
    instance.Relations[relation] = value;
}


export function HasOne(local_key?: string, foreign_key?: string) {
    return function (target: Model, key: string, descriptor: PropertyDescriptor) {
        target.RecordInfo.Relations[key] = 'has-one';

        let original_value = descriptor.value;
        descriptor.enumerable = false;
        descriptor.value = function (this: Model) {
            let r = get_relation_value(this, key);
            if (!r) {
                r = original_value();
                if (!Object.isModel(r)) throw "Return value of a method decorated as a HasOne relation must be an instance of a model";
                let lk = local_key || 'id';
                let fk = foreign_key || r.RecordInfo.Name + '_id';
                r.SetAttribute(fk.snakeCaseToCamelCase(), this.GetAttribute(lk.snakeCaseToCamelCase()));
                set_relation_value(this, key, r);
            }
            return r;
        };
        descriptor.configurable = false;
        return descriptor;
    }
}

export function BelongsTo(local_key?: string, foreign_key?: string) {
    return function (target: Model, key: string, descriptor: PropertyDescriptor) {
        target.RecordInfo.Relations[key] = 'belongs-to';

        let original_value = descriptor.value;
        descriptor.enumerable = false;
        descriptor.value = function (this: Model) {
            let r = get_relation_value(this, key);
            if (!r) {
                r = original_value();
                if (!Object.isModel(r)) throw "Return value of a method decorated as a BelongsTo relation must be an instance of a model";
                let lk = local_key || r.RecordInfo.Name + '_id';
                let fk = foreign_key || 'id';
                r.SetAttribute(fk.snakeCaseToCamelCase(), this.GetAttribute(lk.snakeCaseToCamelCase()));
                set_relation_value(this, key, r);
            }
            return r;

        };
        descriptor.configurable = false;
        return descriptor;
    }
}

export function HasMany(local_key?: string, foreign_key?: string) {
    return function (target: Model, key: string, descriptor: PropertyDescriptor) {
        target.RecordInfo.Relations[key] = 'has-many';
        let original_value = descriptor.value;
        descriptor.enumerable = false;

        descriptor.value = function (this: Model) {
            let r: Repository<Model> = get_relation_value(this, key);
            if (!r) {
                r = original_value();
                if (!Object.isRepository(r)) throw "Return value of a method decorated as a HasMany relation must be an instance of a repository";
                let lk = local_key || 'id';
                let fk = foreign_key || this.RecordInfo.Name + '_id';
                r.WhereEquals(fk, this.GetAttribute(lk.snakeCaseToCamelCase()), true);
                console.log(lk,fk,r.GetFilters());
                set_relation_value(this, key, r);
            }
            return r;

        };
        descriptor.configurable = false;
        return descriptor;
    }
}