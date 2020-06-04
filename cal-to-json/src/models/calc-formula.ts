import IBaseClass, { BaseClass } from './base-class';
import IFilterCondition from './filter-condition';

export default interface ICalcFormula extends IBaseClass {
  method: string;
  reverseSign: boolean | undefined;
  table: string;
  field: string | undefined;
  tableFilter: Array<IFilterCondition> | undefined;
}

export class CalcFormula extends BaseClass implements ICalcFormula {
  method: string;
  reverseSign: boolean | undefined;
  table: string;
  field: string | undefined;
  tableFilter: Array<IFilterCondition> | undefined;

  constructor(
    method: string,
    reverseSign: boolean | undefined,
    table: string,
    field: string | undefined,
    tableFilter: Array<IFilterCondition> | undefined
  ) {
    super('CalcFormula');
    this.method = method;
    this.reverseSign = reverseSign;
    this.table = table;
    this.field = field;
    this.tableFilter = tableFilter;
  }
}
