import StringBuffer from "../util/string-buffer";
import VariableReader, { IVariable } from "./variable-reader";
import { CodeReader } from "./code-reader";
import IBaseClass, { BaseClass } from "../models/base-class";
import StringHelper from "../util/string-helper";

export interface ITrigger extends IBaseClass {
    variables: Array<IVariable> | undefined;
    body: any;
}

export class Trigger extends BaseClass implements ITrigger {
    variables: Array<IVariable> | undefined;
    body: any;

    constructor(
        variables: Array<IVariable> | undefined,
        body: any
    ) {
        super('Trigger');
        this.variables = variables;
        this.body = body;
    }
}

export default class TriggerReader {
    static read(input: string) {
        return this.readTrigger(input);
    }

    private static readTrigger(input: string): ITrigger {
        const m = input.trimRight().match(/\r?\n(\s*)END;$/);
        let len = (m) ? m[1].length : 0;
        input = StringHelper.removeIndentation(input, len);
        const lines = input.split(/\r?\n/);
        const variablesBuffer = new StringBuffer();
        const bodyBuffer = new StringBuffer();

        let current = 0;
        while (current < lines.length) {
            let line = lines[current];

            if (line == '') {
                current++;
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

        const variables = VariableReader.readMultiple(variablesBuffer.toString());
        // const body = CodeReader.read(bodyBuffer.toString());

        return new Trigger(variables, bodyBuffer.toString());
    }
}