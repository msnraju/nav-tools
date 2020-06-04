import IBaseClass, { BaseClass } from "./base-class";
import { IProperty } from "../cal/property-map";

export default interface ITableField extends IBaseClass {
  id: number;
  enabled: boolean | undefined;
  name: string;
  dataType: string;
  properties: Array<IProperty> | undefined;
}

export class TableField extends BaseClass implements ITableField {
  id: number;
  enabled: boolean | undefined;
  name: string;
  dataType: string;
  properties: Array<IProperty> | undefined;

  constructor(
    id: number,
    enabled: boolean | undefined,
    name: string,
    dataType: string,
    properties: Array<IProperty> | undefined
  ) {
    super("TableField");
    this.id = id;
    this.enabled = enabled;
    this.name = name;
    this.dataType = dataType;
    this.properties = properties;
  }
}
