import IBaseClass, { BaseClass } from './base-class';
import { IProperty } from '../cal/property-map';

export default interface IReportDataItem extends IBaseClass {
  id: number;
  dataType: string;
  name: string | undefined;
  indentation: number;
  properties: Array<IProperty> | undefined;
}

export class ReportDataItem extends BaseClass implements IReportDataItem {
  id: number;
  dataType: string;
  name: string | undefined;
  indentation: number;
  properties: Array<IProperty> | undefined;

  constructor(
    id: number,
    dataType: string,
    name: string | undefined,
    indentation: number,
    properties: Array<IProperty> | undefined
  ) {
    super('ReportDataItem');
    this.id = id;
    this.dataType = dataType;
    this.name = name;
    this.indentation = indentation;
    this.properties = properties;
  }
}
