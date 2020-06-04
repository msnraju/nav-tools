import { IVariable } from '../cal/variable-reader';
import IBaseClass, { BaseClass } from './base-class';

export interface IParameter extends IBaseClass {
  byReference: boolean | undefined;
  variable: IVariable;
}

export class Paramter extends BaseClass implements IParameter {
  byReference: boolean | undefined;
  variable: IVariable;

  constructor(byReference: boolean | undefined, variable: IVariable) {
    super('Parameter');
    this.byReference = byReference;
    this.variable = variable;
  }
}
