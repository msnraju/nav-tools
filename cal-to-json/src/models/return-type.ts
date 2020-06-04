import IBaseClass, { BaseClass } from './base-class';

export interface IReturnType extends IBaseClass {
  name: string | undefined;
  datatype: string;
  length: number | undefined;
}

export class ReturnType extends BaseClass implements IReturnType {
  name: string | undefined;
  datatype: string;
  length: number | undefined;

  constructor(
    name: string | undefined,
    datatype: string,
    length: number | undefined
  ) {
    super('ReturnType');

    this.name = name;
    this.datatype = datatype;
    this.length = length;
  }
}
