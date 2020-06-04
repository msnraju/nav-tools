import IPermission, { Permission } from '../models/permission';

export default class PermissionReader {
  static readMultiple(input: string): Array<IPermission> {
    if (!input) return [];

    const lines = input.replace(/\r?\n/g, '').split(',');
    const permissions: Array<IPermission> = [];
    for (var i = 0; i < lines.length; i++) {
      permissions.push(this.read(lines[i]));
    }
    return permissions;
  }

  static read(input: string): IPermission {
    return this.readPermission(input);
  }

  private static readPermission(input: string): IPermission {
    const PERMISSION_EXPR = /(\w*) (\d*)=(.*)/;
    if (!PERMISSION_EXPR.test(input))
      throw new Error(`Invalid permission '${input}'`);

    const match = PERMISSION_EXPR.exec(input);
    if (!match) throw new Error(`Invalid permission '${input}'`);

    const objectType = match[1];
    const objectId = Number(match[2]);
    const permissions = match[3];
    const read = /r/i.test(permissions);
    const insert = /i/i.test(permissions);
    const modify = /m/i.test(permissions);
    const delete2 = /d/i.test(permissions);
    const execute = /e/i.test(permissions);

    return new Permission(
      objectType,
      objectId,
      read,
      insert,
      modify,
      delete2,
      execute
    );
  }
}
