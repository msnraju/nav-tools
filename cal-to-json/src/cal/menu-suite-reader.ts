import PropertyReader from "./property-reader";
import PropertyMap, { IProperty } from "./property-map";
import StringHelper from "../util/string-helper";
import IBaseClass, { BaseClass } from "../models/base-class";

export interface IMenuNode extends IBaseClass {
  type: string;
  id: string;
  properties: Array<IProperty> | undefined;
}

export class MenuNode extends BaseClass implements IMenuNode {
  type: string;
  id: string;
  properties: Array<IProperty> | undefined;

  constructor(
    type: string,
    id: string,
    properties: Array<IProperty> | undefined
  ) {
    super("MenuNode");
    this.type = type;
    this.id = id;
    this.properties = properties;
  }
}

export default class MenuSuiteReader {
  static readSegment(name: string, input: string) {
    switch (name) {
      case "PROPERTIES":
        return PropertyReader.read(input, PropertyMap.menuSuiteProperties);
      case "MENUNODES":
        return this.readMenuNodes(input);
      default:
        throw new TypeError(`Report's segment type '${name}' not implemented.`);
    }
  }

  static readMenuNodes(input: string): Array<IMenuNode> {
    input = StringHelper.remove4SpaceIndentation(input);
    const menuNodes: Array<IMenuNode> = [];
    const lines = StringHelper.groupLines(input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const menuNode = this.readMenuNode(line);
      menuNodes.push(menuNode);
    }

    return menuNodes;
  }

  static readMenuNode(input: string): IMenuNode {
    const NODE_EXPR = /{ (\w*)\s*?;(\[.*?\]|.*?)\s*?(;((.*\r?\n?)*?))? }/;
    if (!NODE_EXPR.test(input)) throw new Error(`Invalid field '${input}'`);

    const match = NODE_EXPR.exec(input);
    if (!match) throw new Error(`Invalid menu node '${input}'`);

    const type = match[1];
    const id = StringHelper.unescapeBrackets(match[2]);

    let properties = match[4];
    properties = properties.replace(/^[ ]{59}/, "");
    properties = properties.replace(/\r?\n[ ]{59}/g, "\r\n");
    const props = PropertyReader.read(properties, PropertyMap.menuNode);

    return new MenuNode(type, id, props);
  }
}
