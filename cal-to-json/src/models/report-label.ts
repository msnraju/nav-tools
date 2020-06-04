import IBaseClass, { BaseClass } from './base-class';
import { IProperty } from '../cal/property-map';

export default interface IReportLabel extends IBaseClass {
  id: number;
  name: string;
  properties: Array<IProperty> | undefined;
}

export class ReportLabel extends BaseClass implements IReportLabel {
  id: number;
  name: string;
  properties: Array<IProperty> | undefined;

  constructor(
    id: number,
    name: string,
    properties: Array<IProperty> | undefined
  ) {
    super('ReportLabel');
    this.id = id;
    this.name = name;
    this.properties = properties;
  }
}
