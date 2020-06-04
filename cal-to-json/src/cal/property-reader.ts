import { IPropertyMap, Property, IProperty } from './property-map';
import StringHelper from '../util/string-helper';
import { PropertyType } from './property-type';
import TextMLReader from './text-ml-reader';
import TableRelationReader from './table-relation-reader';
import CalcFormulaReader from './calc-formula-reader';
import PermissionReader from './permission-reader';
import TableViewReader from './table-view-reader';
import PageReader from './page-reader';
import TableFiltersReader from './table-filter-reader';
import DataItemLinkReader from './data-item-link-reader';
import OrderByReader from './order-by-reader';
import TriggerReader from './trigger-reader';

export default class PropertyReader {
  static read(
    input: string,
    maps: Array<IPropertyMap>
  ): Array<IProperty> | undefined {
    let props: Array<IProperty> | undefined = undefined;
    const PROP_EXPR = /([\w:\s]*)=((.*\r?\n?)*)/;

    input = StringHelper.remove4SpaceIndentation(input);

    const lines = StringHelper.groupLines(input);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!PROP_EXPR.test(line)) throw new Error(`Invalid property '${line}'`);

      const match = PROP_EXPR.exec(line);
      if (!match) throw new Error(`Invalid property '${line}'`);

      const name = match[1];
      let value: string = match[2];

      if (value.endsWith(';')) value = value.slice(0, -1);

      if (name === 'ActionList' && value === 'ACTIONS') {
        value += `\r\n${lines[++i]}\r\n${lines[++i]}`;
      }

      props = props || [];
      props.push(this.getProperty(name, value, maps));
    }

    return props;
  }

  private static getProperty(
    name: string,
    value: string,
    maps: Array<IPropertyMap>
  ): IProperty {
    const propType = maps.find(p => p.name === name);
    if (!propType) throw new TypeError(`Property map not found for '${name}'`);

    switch (propType.type) {
      case PropertyType.Text:
      case PropertyType.Boolean:
      case PropertyType.Integer:
      case PropertyType.FieldList:
      case PropertyType.Option:
        return new Property(name, propType.type, value);
      case PropertyType.TextML:
        return new Property(name, propType.type, TextMLReader.read(value));
      case PropertyType.TableRelation:
        return new Property(
          name,
          propType.type,
          TableRelationReader.read(value)
        );
      case PropertyType.CalcFormula:
        return new Property(name, propType.type, CalcFormulaReader.read(value));
      case PropertyType.Permission:
        return new Property(name, propType.type, PermissionReader.read(value));
      case PropertyType.Permissions:
        return new Property(
          name,
          propType.type,
          PermissionReader.readMultiple(value)
        );
      case PropertyType.TableView:
        return new Property(name, propType.type, TableViewReader.read(value));
      case PropertyType.ActionList:
        return new Property(name, propType.type, PageReader.readActions(value));
      case PropertyType.TableFilter:
        return new Property(
          name,
          propType.type,
          TableFiltersReader.readFilters(value)
        );
      case PropertyType.DataItemLink:
        return new Property(
          name,
          propType.type,
          DataItemLinkReader.read(value)
        );
      case PropertyType.OrderBy:
        return new Property(name, propType.type, OrderByReader.read(value));
      case PropertyType.Trigger:
        return new Property(name, propType.type, TriggerReader.read(value));
      default:
        throw new TypeError(`Property type '${propType.type}' not implemented`);
    }
  }
}
