import IBaseClass, { BaseClass } from "./base-class";

export default interface IFieldGroup extends IBaseClass {
    id: number,
    name: string;
    fields: Array<string>
}

export class FieldGroup extends BaseClass implements IFieldGroup {
    id: number;
    name: string;
    fields: Array<string>;

    constructor(
        id: number,
        name: string,
        fields: Array<string>
    ) {
        super('FieldGroup');
        this.id = id;
        this.name = name;
        this.fields = fields;
    }
}