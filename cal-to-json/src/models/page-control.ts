import IBaseClass, { BaseClass } from './base-class';
import { IProperty } from '../cal/property-map';

export default interface IPageControl extends IBaseClass {
  id: number;
  indentation: number;
  type: string;
  properties: Array<IProperty> | undefined;
}

export class PageControl extends BaseClass implements IPageControl {
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
    super('ReportControl');
    this.id = id;
    this.indentation = indentation;
    this.type = type;
    this.properties = properties;
  }
}
