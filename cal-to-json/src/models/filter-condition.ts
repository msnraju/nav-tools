import IBaseClass, { BaseClass } from "./base-class";

export default interface IFilterCondition extends IBaseClass {
  field: string;
  type: string;
  value: string;
  filter: boolean | undefined;
  upperLimit: boolean | undefined;
}

export class FilterCondition extends BaseClass implements IFilterCondition {
  field: string;
  type: string;
  value: string;
  upperLimit: boolean | undefined;
  filter: boolean | undefined;

  constructor(
    field: string,
    type: string,
    value: string,
    upperLimit: boolean | undefined,
    filter: boolean | undefined
  ) {
    super("FilterCondition");
    this.field = field;
    this.type = type;
    this.value = value;
    this.upperLimit = upperLimit;
    this.filter = filter;
  }
}
