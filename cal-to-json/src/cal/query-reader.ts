import PropertyReader from "./property-reader";
import PropertyMap, { IProperty } from "./property-map";
import IBaseClass, { BaseClass } from "../models/base-class";
import StringHelper from "../util/string-helper";

export interface IQueryElement extends IBaseClass {
    id: number;
    indentation: number;
    type: string;
    name: string | undefined;
    properties: Array<IProperty> | undefined;
}

export class QueryElement extends BaseClass implements IQueryElement {
    id: number;
    indentation: number;
    type: string;
    name: string | undefined;
    properties: Array<IProperty> | undefined;

    constructor(
        id: number,
        indentation: number,
        type: string,
        name: string | undefined,
        properties: Array<IProperty> | undefined
    ) {
        super('QueryElement');
        this.id = id;
        this.indentation = indentation;
        this.type = type;
        this.name = name;
        this.properties = properties;
    }
}

export default class QueryReader {
    static readSegment(name: string, input: string) {
        switch (name) {
            case 'PROPERTIES':
                return PropertyReader.read(input, PropertyMap.queryProperties);
            case 'ELEMENTS':
                return this.getElements(input);
            default:
                throw new TypeError(`Report's segment type '${name}' not implemented.`);
        }
    }

    static getElements(input: string): Array<IQueryElement> {
        input = StringHelper.remove4SpaceIndentation(input);
        const elements: Array<IQueryElement> = [];
        const lines = StringHelper.groupLines(input);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const element = this.getElement(line);
            elements.push(element);
        }

        return elements;
    }

    static getElement(input: string): IQueryElement {
        const ELEMENT_EXPR = /{ (\d*)\s*?;(\d*)\s*?;(\w*)\s*?;(\[.*?\]|.*?)\s*?(;((.*\r?\n?)*?))? }/;
        if (!ELEMENT_EXPR.test(input))
            throw new Error(`Invalid query element '${input}'`);

        const match = ELEMENT_EXPR.exec(input);
        if (!match)
            throw new Error(`Invalid query element '${input}'`);

        const id = Number(match[1]);
        const indentation = Number(match[2] || 0);
        const type = match[3];
        const name = StringHelper.unescapeBrackets(match[4]) || undefined;

        let properties = match[6] || '';
        properties = properties.replace(/^[ ]{11}/, '');
        properties = properties.replace(/\r?\n[ ]{11}/g, '\r\n');
        const props = PropertyReader.read(properties, PropertyMap.queryElement);

        return new QueryElement(id, indentation, type, name, props);
    }
}