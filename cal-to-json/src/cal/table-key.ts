import IBaseClass, { BaseClass } from "../models/base-class";
import { IProperty } from "./property-map";

export default interface ITableKey extends IBaseClass {
  enabled: boolean;
  fields: Array<string>;
  properties: Array<IProperty> | undefined;
}

export class TableKey extends BaseClass implements ITableKey {
  enabled: boolean;
  fields: Array<string>;
  properties: Array<IProperty> | undefined;

  constructor(
    enabled: boolean,
    fields: Array<string>,
    properties: Array<IProperty> | undefined
  ) {
    super("TableKey");
    this.enabled = enabled;
    this.fields = fields;
    this.properties = properties;
  }
}
