import IBaseClass, { BaseClass } from './base-class';
import IFilterCondition from './filter-condition';

export default interface ITableRelation extends IBaseClass {
  conditions: Array<IFilterCondition> | undefined;
  table: string;
  field: string | undefined;
  tableFilters: Array<IFilterCondition> | undefined;
  alternate: ITableRelation | undefined;
}

export class TableRelation extends BaseClass implements ITableRelation {
  conditions: Array<IFilterCondition> | undefined;
  table: string;
  field: string | undefined;
  tableFilters: Array<IFilterCondition> | undefined;
  alternate: ITableRelation | undefined;

  constructor(
    conditions: Array<IFilterCondition> | undefined,
    table: string,
    field: string | undefined,
    tableFilters: Array<IFilterCondition> | undefined,
    alternate: ITableRelation | undefined
  ) {
    super('TableRelation');
    this.conditions = conditions;
    this.table = table;
    this.field = field;
    this.tableFilters = tableFilters;
    this.alternate = alternate;
  }
}
