import TextConstantReader from './text-constant-reader';
import StringHelper from '../util/string-helper';
import IBaseClass, { BaseClass } from '../models/base-class';
import ILangText from '../models/lang-text';

export interface IVariable extends IBaseClass {
  id: number;
  name: string;
  datatype: string;
  length: number | undefined;
  dimensions: string | undefined;
  temporary: boolean | undefined;
  subType: string | number | undefined;
  inDataSet: boolean | undefined;
  securityfiltering: string | undefined;
  textML: Array<ILangText> | undefined;
}

export class Variable extends BaseClass implements IVariable {
  id: number;
  name: string;
  datatype: string;
  length: number | undefined;
  dimensions: string | undefined;
  temporary: boolean | undefined;
  subType: string | number | undefined;
  inDataSet: boolean | undefined;
  securityfiltering: string | undefined;
  textML: Array<ILangText> | undefined;

  constructor(
    id: number,
    name: string,
    datatype: string,
    length: number | undefined,
    dimensions: string | undefined,
    temporary: boolean | undefined,
    subType: string | number | undefined,
    inDataSet: boolean | undefined,
    securityfiltering: string | undefined,
    textML: Array<ILangText> | undefined
  ) {
    super('Variable');

    this.id = id;
    this.name = name;
    this.datatype = datatype;
    this.length = length;
    this.dimensions = dimensions;
    this.temporary = temporary;
    this.subType = subType;
    this.inDataSet = inDataSet;
    this.securityfiltering = securityfiltering;
    this.textML = textML;
  }
}

export default class VariableReader {
  static read(input: string): IVariable {
    return this.readVariable(input);
  }

  static readMultiple(input: string): Array<IVariable> | undefined {
    let variables: Array<IVariable> | undefined = undefined;
    input = input?.replace(/^VAR\r?\n/, '');
    input = StringHelper.remove2SpaceIndentation(input);
    const lines = StringHelper.groupLines(input);
    for (let i = 0; i < lines.length; i++) {
      const variable = this.read(lines[i]);

      variables = variables || [];
      variables.push(variable);
    }

    return variables;
  }

  private static readVariable(input: string): IVariable {
    const VARIABLE_EXPR = /(.*|".*")@(-?\d*) : (ARRAY \[([\d,]*)\] OF )?(TEMPORARY )?(\w*\[\d*\]|'.*?'|\w*)?( ((.*\r?\n?)*?))?;/;
    if (!VARIABLE_EXPR.test(input))
      throw new Error(`Invalid variable: ${input}`);

    const match = VARIABLE_EXPR.exec(input);
    if (!match) throw new Error(`Invalid variable: ${input}`);

    const name = match[1];
    const id = Number(match[2] || 0);
    const dimensions = match[4];
    const temporary =
      match[5] === undefined ? undefined : match[5] ? true : undefined;

    let datatype = match[6];
    let text = match[8] || '';
    let subType: string | number | undefined = undefined;
    let textML: Array<ILangText> | undefined = undefined;
    let securityfiltering = undefined;
    let length = undefined;

    const LENGTH_EXPR = /(\w*)\[(\d*)\]/;
    if (LENGTH_EXPR.test(datatype)) {
      const match = LENGTH_EXPR.exec(datatype);
      if (!match) throw new Error(`Invalid variable: ${input}`);

      datatype = match[1];
      length = Number(match[2]);
    }

    switch (datatype) {
      case 'Record':
      case 'Page':
      case 'Report':
      case 'Codeunit':
      case 'Query':
      case 'XMLport':
        const ID_EXPR = /(\d*) ?(.*)?/;
        const SECURITY_FILTERING_EXPR = /SECURITYFILTERING\((\w*)\)/;

        if (!ID_EXPR.test(text)) throw new Error(`Invalid variable: ${input}`);

        const match = ID_EXPR.exec(text);
        if (!match) throw new Error(`Invalid variable: ${input}`);

        subType = Number(match[1]);
        text = match[2] || '';

        if (
          (datatype === 'Record' || datatype === 'Query') &&
          SECURITY_FILTERING_EXPR.test(text)
        ) {
          const match2 = SECURITY_FILTERING_EXPR.exec(text);
          if (!match2) throw new Error(`Invalid variable: ${input}`);

          securityfiltering = match2[1];
          text = '';
        }

        break;
    }

    let inDataSet = undefined;
    if (text === 'INDATASET') {
      inDataSet = true;
      text = '';
    }

    if (text) {
      switch (datatype) {
        case 'TextConst':
          textML = TextConstantReader.read(text);
          break;
        case 'DotNet':
        case 'Automation':
        case 'OCX':
          subType = StringHelper.escapeDoubleQuoteString(text);
          break;
        default:
          throw new Error(`Invalid variable: ${input}`);
      }
    }

    return new Variable(
      id,
      name,
      datatype,
      length,
      dimensions,
      temporary,
      subType,
      inDataSet,
      securityfiltering,
      textML
    );
  }
}
