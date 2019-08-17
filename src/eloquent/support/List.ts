export class List<T> {
    private items: T[];

    constructor(items?: T[]) {
        this.items = items || [];
    }

    /**
     * Adds an item to the collection
     * @param key
     * @param value
     * @constructor
     */
    public Push(value: any): this {
        this.items.push(value)
        return this;
    }

    public ToJson() {
        return this.items;
    }

    public Empty() {
        this.items = [];
        return this;
    }
}
