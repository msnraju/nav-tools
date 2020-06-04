import IBaseClass, { BaseClass } from './base-class';

export default interface IPermission extends IBaseClass {
  objectType: string;
  objectId: number;
  read: boolean;
  insert: boolean;
  modify: boolean;
  delete2: boolean;
  execute: boolean;
}

export class Permission extends BaseClass implements IPermission {
  objectType: string;
  objectId: number;
  read: boolean;
  insert: boolean;
  modify: boolean;
  delete2: boolean;
  execute: boolean;

  constructor(
    objectType: string,
    objectId: number,
    read: boolean,
    insert: boolean,
    modify: boolean,
    delete2: boolean,
    execute: boolean
  ) {
    super('Permission');
    this.objectType = objectType;
    this.objectId = objectId;
    this.read = read;
    this.insert = insert;
    this.modify = modify;
    this.delete2 = delete2;
    this.execute = execute;
  }
}
