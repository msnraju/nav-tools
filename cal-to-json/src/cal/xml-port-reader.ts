import PropertyReader from './property-reader';
import PropertyMap, { IProperty } from './property-map';
import IBaseClass, { BaseClass } from '../models/base-class';
import StringHelper from '../util/string-helper';
import ObjectReader from './object-reader';

export interface IXMLportElement extends IBaseClass {
  id: string;
  indentation: number;
  nodeName: string;
  nodeType: string;
  sourceType: string;
  properties: Array<IProperty> | undefined;
}

export class XMLportElement extends BaseClass implements IXMLportElement {
  id: string;
  indentation: number;
  nodeName: string;
  nodeType: string;
  sourceType: string;
  properties: Array<IProperty> | undefined;

  constructor(
    id: string,
    indentation: number,
    nodeName: string,
    nodeType: string,
    sourceType: string,
    properties: Array<IProperty> | undefined
  ) {
    super('XMLportElement');
    this.id = id;
    this.indentation = indentation;
    this.nodeName = nodeName;
    this.nodeType = nodeType;
    this.sourceType = sourceType;
    this.properties = properties;
  }
}

export default class XMLportReader {
  static readSegment(name: string, input: string) {
    switch (name) {
      case 'PROPERTIES':
        return PropertyReader.read(input, PropertyMap.xmlPortProperties);
      case 'ELEMENTS':
        return this.readElements(input);
      case 'EVENTS':
        return this.readEvents(input);
      case 'REQUESTPAGE':
        return this.readRequestPage(input);
      default:
        throw new TypeError(`Invalid segment type'${name}'`);
    }
  }

  private static readRequestPage(input: string) {
    input = StringHelper.remove2SpaceIndentation(input);
    return ObjectReader.splitSegments('Page', input);
  }

  static readEvents(input: string) {
    if (input.trim().length !== 0) {
      throw new Error(`XMLport events: \n${input}`);
    }

    input = StringHelper.remove4SpaceIndentation(input);
    return input;
  }

  static readElements(input: string): Array<IXMLportElement> {
    input = StringHelper.remove4SpaceIndentation(input);
    const elements: Array<IXMLportElement> = [];
    const lines = StringHelper.groupLines(input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const element = this.getElement(line);
      elements.push(element);
    }

    return elements;
  }

  static getElement(input: string): IXMLportElement {
    const ELEMENT_EXPR = /{ (\[.*?\]|.*?)\s*?;(\d*)\s*?;(.*)\s*?;(\w*)\s*?;(\w*)\s*?(;((.*\r?\n?)*?))? }/;
    if (!ELEMENT_EXPR.test(input)) throw new Error(`Invalid field '${input}'`);

    const match = ELEMENT_EXPR.exec(input);
    if (!match) throw new Error(`Invalid field '${input}'`);

    const id = match[1];
    const indentation = Number(match[2] || 0);
    const nodeName = match[3];
    const nodeType = match[4];
    const sourceType = match[5];

    let properties = match[7] || '';
    properties = properties.replace(/^[ ]{46}/, '');
    properties = properties.replace(/\r?\n[ ]{46}/g, '\r\n');
    const props = PropertyReader.read(properties, PropertyMap.xmlPortElement);

    return new XMLportElement(
      id,
      indentation,
      nodeName,
      nodeType,
      sourceType,
      props
    );
  }
}
