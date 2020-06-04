import StringBuffer from "../util/string-buffer";
import VariableReader from "./variable-reader";
import StringHelper from "../util/string-helper";
import AttributeReader from "./attribute-reader";
import { Event } from "../models/event";
import { IProcedure, Procedure } from "../models/procedure";
import { IParameter, Paramter } from "../models/parameter";
import { IReturnType, ReturnType } from "../models/return-type";

export default class ProcedureReader {
  static readMultiple(input: Array<string>): Array<IProcedure> | undefined {
    let procedures: Array<IProcedure> | undefined = undefined;
    for (let i = 0; i < input.length; i++) {
      procedures = procedures || [];
      procedures.push(this.readProcedure(input[i]));
    }

    return procedures;
  }

  static read(input: string) {
    return this.readProcedure(input);
  }

  private static readProcedure(input: string): IProcedure {
    const lines = input.split(/\r?\n/);
    const attributesBuffer = new StringBuffer();
    const variablesBuffer = new StringBuffer();
    const declarationBuffer = new StringBuffer();
    const bodyBuffer = new StringBuffer();

    let current = 0;
    while (current < lines.length) {
      let line = lines[current];

      // Attributes
      if (/^\[.*\]/.test(line)) {
        while (/^\[.*\]/.test(line)) {
          attributesBuffer.append(line);
          line = lines[++current];
        }

        continue;
      }

      // Variables
      if (/^VAR/.test(line)) {
        while (!/^BEGIN/.test(line)) {
          variablesBuffer.append(line);
          line = lines[++current];
        }

        continue;
      }

      // Procedure
      if (/^LOCAL|^PROCEDURE|^EVENT/.test(line)) {
        declarationBuffer.append(line);
        current++;
        continue;
      }

      // Body
      if (/^BEGIN/.test(line)) {
        while (!/^END;/.test(line)) {
          bodyBuffer.append(line);
          line = lines[++current];
        }

        bodyBuffer.append(line);
        current++;
        continue;
      }

      throw new Error(`Invalid procedure line: ${line}`);
    }

    return this.getProcedure(
      declarationBuffer.toString(),
      attributesBuffer.toString(),
      variablesBuffer.toString(),
      bodyBuffer.toString()
    );
  }

  private static getProcedure(
    input: string,
    attributesText: string,
    variablesText: string,
    bodyText: string
  ) {
    const PROCEDURE_EXPR = /((EVENT )(\w*|".*")@(\d*)::)?((LOCAL )?PROCEDURE )?(\w*|".*")@(-?\d*)\((.*)\) ?(.*);/;
    if (!PROCEDURE_EXPR.test(input))
      throw new Error(`Invalid Procedure: ${input}`);

    const match = PROCEDURE_EXPR.exec(input);
    if (!match) throw new Error(`Invalid Procedure: ${input}`);

    const event = match[2] == "EVENT ";
    const eventVariable = StringHelper.escapeDoubleQuoteString(match[3] || "");
    const eventVariableId = Number(match[4] || 0);
    const local = match[6] == "LOCAL " ? true : undefined;
    const name = StringHelper.escapeDoubleQuoteString(match[7] || "");
    const id = Number(match[8] || 0);
    const parameters = this.readParameters(match[9] || "");
    const returns = this.readReturns(match[10] || "");

    const attributes = AttributeReader.readMultiple(attributesText);
    const variables = VariableReader.readMultiple(variablesText);
    //const body =  CodeReader.read(bodyText);
    const body = bodyText;

    if (event) {
      return new Event(
        eventVariable,
        eventVariableId,
        local,
        id,
        name,
        attributes,
        parameters,
        returns || undefined,
        variables,
        body
      );
    } else {
      return new Procedure(
        local,
        id,
        name,
        attributes,
        parameters,
        returns || undefined,
        variables,
        body
      );
    }
  }

  private static readReturns(input: string): IReturnType | undefined {
    if (!input) return undefined;

    const RETURN_EXPR = /(".*"|\w*)?: (\w*)(\[(\d*)\])?/;
    if (!RETURN_EXPR.test(input))
      throw new Error(`Invalid return type: ${input}`);

    const match = RETURN_EXPR.exec(input);
    if (!match) throw new Error(`Invalid return type: ${input}`);

    const name = StringHelper.escapeDoubleQuoteString(match[1] || "");
    const datatype = match[2];
    const length = Number(match[4] || "0");

    return new ReturnType(name || undefined, datatype, length || undefined);
  }

  private static readParameters(input: string): Array<IParameter> | undefined {
    let parameters: Array<IParameter> | undefined = undefined;
    if (!input) return parameters;

    const PARAM_EXPR = /(VAR )?([^@]*|".*")@(-?\d*) : (ARRAY \[([\d,]*)\] OF )?(TEMPORARY )?(\w*\[\d*\]|\w*|'.*?';)?( ([^;]*))?;?/g;
    const params = (input + ";").match(PARAM_EXPR);
    if (!params) throw new Error(`Invalid Parameters: ${input}`);

    const VAR_EXPR = /(VAR )?(.*)/;
    for (let i = 0; i < params.length; i++) {
      let line = params[i];

      let byReference = undefined;
      if (VAR_EXPR.test(line)) {
        byReference = true;
        const match = VAR_EXPR.exec(line);
        if (!match) throw new Error(`Invalid Parameters: ${input}`);
        line = match[2];
      }

      const variable = VariableReader.read(line);
      parameters = parameters || [];
      parameters.push(new Paramter(byReference, variable));
    }

    return parameters;
  }
}
