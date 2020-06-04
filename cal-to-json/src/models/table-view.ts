import IBaseClass, { BaseClass } from './base-class';
import IFilterCondition from './filter-condition';

export default interface ITableView extends IBaseClass {
  key: Array<string> | null;
  order: string | null;
  tableFilter: Array<IFilterCondition> | null;
}

export class TableView extends BaseClass implements ITableView {
  key: Array<string> | null;
  order: string | null;
  tableFilter: Array<IFilterCondition> | null;

  constructor(
    key: Array<string> | null,
    order: string | null,
    tableFilter: Array<IFilterCondition> | null
  ) {
    super('TableView');
    this.key = key;
    this.order = order;
    this.tableFilter = tableFilter;
  }
}
