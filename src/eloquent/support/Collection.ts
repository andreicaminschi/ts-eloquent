export class Collection<T> {
    private items: Dictionary<T>;

    constructor(items?: Dictionary<T>) {
        this.items = items || {};
    }

    /**
     * Adds an item to the collection
     * @param key
     * @param value
     * @constructor
     */
    public Put(key: string, value: any): this {
        this.items[key] = value;
        return this;
    }

    /**
     * Gets the value of an item in the collection.
     * If the item is not present, default_value is returned
     * @param key
     * @param default_value
     * @constructor
     */
    public Get(key: string, default_value: any = null): any { return this.items[key] || default_value; }

    /**
     * Determines if the collection contains the given key
     * @param key
     * @constructor
     */
    public Has(key: string): boolean { return typeof this.items[key] !== "undefined"}

    /**
     * Removes the given key from the collection
     * @param key
     * @constructor
     */
    public Forget(key: string) {
        delete this.items[key];
        return this;
    }

    public Empty() {
        this.items = {};
        return this;
    }

    public ToJson() {
        return this.items;
    }
}
