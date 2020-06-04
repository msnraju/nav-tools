import { IProperty } from "../cal/property-map";
import IBaseClass, { BaseClass } from "./base-class";

export interface IPageAction extends IBaseClass {
    id: number;
    indentation: number;
    type: string;
    properties: Array<IProperty> | undefined;
}

export class PageAction extends BaseClass implements IPageAction {
    id: number;
    indentation: number;
    type: string;
    properties: Array<IProperty> | undefined;

    constructor(
        id: number,
        indentation: number,
        type: string,
        properties: Array<IProperty> | undefined
    ) {
        super('PageAction');
        this.id = id;
        this.indentation = indentation;
        this.type = type;
        this.properties = properties;
    }
}
