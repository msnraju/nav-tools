import StringHelper from "../util/string-helper";
import StringBuffer from "../util/string-buffer";
import VariableReader from "./variable-reader";
import ProcedureReader from "./procedure-reader";

interface IRawCodeSegment {
    documentation: string;
    variables: string;
    procedures: Array<string>;
}

export default class CodeSegmentReader {
    static read(input: string) {
        const codeSegments: IRawCodeSegment = this.readCodeSegment(input);
        const documentation = this.readDocumentation(codeSegments.documentation);
        const variables = VariableReader.readMultiple(codeSegments.variables);
        const procedures = ProcedureReader.readMultiple(codeSegments.procedures);

        return { documentation, variables, procedures };
    }

    private static readDocumentation(input: string): string | undefined {
        const DOC_EXPR = /BEGIN(\r?\n?((.*\r?\n?)*?))END./;
        if (!DOC_EXPR.test(input))
            throw new Error(`Invalid documentation: \r\n${input}`);

        const match = DOC_EXPR.exec(input);
        if (!match)
            throw new Error(`Invalid documentation: \r\n${input}`);

        return StringHelper.remove2SpaceIndentation(match[2]) || undefined;
    }

    private static readCodeSegment(input: string): IRawCodeSegment {
        input = StringHelper.remove4SpaceIndentation(input);
        const lines = input.replace(/^\r?\n/, '').split(/\r?\n/);

        let documentation = '';
        let variables = '';
        let procedures: Array<string> = [];
        let current = 0;

        while (current < lines.length) {
            let line = lines[current];

            if (line == '') {
                while (line == '') {
                    line = lines[++current];
                }

                continue;
            }

            if (/^VAR/.test(line)) {
                const buffer = new StringBuffer();
                while (!/^EVENT|^LOCAL|^\[|PROCEDURE|^BEGIN/.test(line)) {
                    buffer.append(line);
                    line = lines[++current];
                }

                variables = buffer.toString();
                continue;
            }

            if (/^EVENT|^LOCAL|^\[|PROCEDURE/.test(line)) {
                const buffer = new StringBuffer();
                while (line != 'END;') {
                    buffer.append(line);
                    line = lines[++current];
                }

                buffer.append(line);
                current++;

                const procedure = buffer.toString();
                procedures = procedures || [];
                procedures.push(procedure);
                continue;
            }

            if (/^BEGIN/.test(line)) {
                const buffer = new StringBuffer();
                while (line != 'END.') {
                    buffer.append(line);
                    line = lines[++current];
                }

                buffer.append(line);
                current++;

                documentation = buffer.toString();
                continue;
            }

            throw new Error(`Invalid line:- '${line}'`);
        }

        return { documentation, variables, procedures };
    }
}