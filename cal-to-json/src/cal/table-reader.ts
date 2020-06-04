import FieldListReader from './field-list-reader';
import StringHelper from '../util/string-helper';
import PropertyReader from './property-reader';
import PropertyMap from './property-map';
import ITableField, { TableField } from '../models/table-field';
import IFieldGroup, { FieldGroup } from '../models/field-group';
import ITableKey, { TableKey } from './table-key';

export default class TableReader {
  static readSegment(name: string, input: string) {
    switch (name) {
      case 'PROPERTIES':
        return PropertyReader.read(input, PropertyMap.tableProperties);
      case 'FIELDS':
        return this.getFields(input);
      case 'FIELDGROUPS':
        return this.getFieldGroups(input);
      case 'KEYS':
        return this.getKeys(input);
      default:
        throw new TypeError(`Invalid segment type'${name}'`);
    }
  }

  static getFields(input: string): Array<ITableField> {
    input = StringHelper.remove4SpaceIndentation(input);
    const fields: Array<ITableField> = [];
    const lines = StringHelper.groupLines(input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const field = this.getField(line);
      fields.push(field);
    }

    return fields;
  }

  private static getField(input: string): ITableField {
    const FIELD_EXPR = /{ (\d*)\s*?;(\w*)\s*?;(\[.*?\]|.*?)\s*?;(\w*)\s*?(;((.*\r?\n?)*?))? }/;
    if (!FIELD_EXPR.test(input)) throw new Error(`Invalid field '${input}'`);

    const match = FIELD_EXPR.exec(input);
    if (!match) throw new Error(`Invalid field '${input}'`);

    const id = Number(match[1]);
    const enabled =
      match[2] === 'No'
        ? false
        : match[2] === 'Yes' || match[2] === ''
        ? undefined
        : false;
    const name = StringHelper.unescapeBrackets(match[3]);
    const datatype = match[4];

    let properties = match[6] || '';
    properties = properties.replace(/^[ ]{47}/, '');
    properties = properties.replace(/\r?\n[ ]{47}/g, '\r\n');
    const props = PropertyReader.read(properties, PropertyMap.tableField);

    return new TableField(id, enabled, name, datatype, props);
  }

  static getFieldGroups(input: string): Array<IFieldGroup> | undefined {
    input = StringHelper.remove4SpaceIndentation(input);
    let fieldGroups: Array<IFieldGroup> | undefined = undefined;
    const lines = StringHelper.groupLines(input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      fieldGroups = fieldGroups || [];
      fieldGroups.push(this.getFieldGroup(line));
    }

    return fieldGroups;
  }

  private static getFieldGroup(input: string): IFieldGroup {
    const FIELD_EXPR = /{ (\d*)\s*?;(\w*)\s*?;(\[.*?\]|.*?)\s*? }/;
    if (!FIELD_EXPR.test(input))
      throw new Error(`Invalid field group '${input}'`);

    const match = FIELD_EXPR.exec(input);
    if (!match) throw new Error(`Invalid field group '${input}'`);

    const id = Number(match[1]);
    const name = match[2];
    const fields = FieldListReader.read(match[3]);

    return new FieldGroup(id, name, fields);
  }

  static getKeys(input: string): Array<ITableKey> {
    const keys: Array<ITableKey> = [];

    input = StringHelper.remove4SpaceIndentation(input);
    const lines = StringHelper.groupLines(input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const key = this.getKey(line);
      keys.push(key);
    }

    return keys;
  }

  private static getKey(input: string): ITableKey {
    const KEY_EXPR = /{ (\w*)\s*?;(\[.*?\]|.*?)\s*?(;(.*\r?\n?)*?)? }/;
    if (!KEY_EXPR.test(input)) throw new Error(`Invalid key '${input}'`);

    const match = KEY_EXPR.exec(input);
    if (!match) throw new Error(`Invalid key '${input}'`);

    const enabled =
      match[1] === 'No'
        ? false
        : match[1] === 'Yes' || match[1] === ''
        ? true
        : false;
    const fields = FieldListReader.read(match[2]);
    let properties = match[4] || '';
    properties = properties.replace(/^[ ]{47}/, '');
    properties = properties.replace(/\r?\n[ ]{47}/g, '\r\n');
    const props = PropertyReader.read(properties, PropertyMap.tableKey);

    return new TableKey(enabled, fields, props);
  }
}
