export default class StringHelper {
    static escapeDoubleQuoteString(input: string): string {
        return input?.replace(/\"/g, '""');
    }

    static escapeSingleQuoteString(input: string): string {
        return input?.replace(/\'/g, '\'\'');
    }

    static unescapeSingleQuoteString(input: string): string {
        return input?.replace(/^'(.*)'$/, '$1');
    }

    static unescapeDoubleQuoteString(input: string): string {
        return input?.replace(/^"(.*)"$/, '$1');
    }

    static unescapeBrackets(input: string) {
        let current = 0, value = '';

        while (current < input.length) {
            let char = input[current];

            if (char != '[') {
                value += char;
                current++;
                continue;
            }

            let nextChar = '';
            char = input[++current];
            while ((current < input.length) && (char != ']' || (char == ']' && nextChar == ']'))) {
                value += char;
                if (char == ']' && nextChar == ']') current++;

                char = input[++current];
                nextChar = current + 1 < input.length ? input[current + 1] : '';
            }

            current++;
        }

        return value;
    }

    static groupLines(input: string) {
        const SPLIT_EXPR = /\r?\n/;
        const properties: string[] = [];

        let lines = input.split(SPLIT_EXPR);
        lines = lines.length > 0 && !lines[0] ? lines.splice(1) : lines;
        let propBuffer: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line[0] == ' ' || line == '')
                propBuffer.push(line);
            else {
                if (propBuffer.length > 0)
                    properties.push(propBuffer.join('\r\n'));

                propBuffer = [line];
            };
        }

        if (propBuffer.length > 0)
            properties.push(propBuffer.join('\r\n'));

        return properties;
    }

    static remove4SpaceIndentation(input: string) {
        return input.replace(/^    /, '').replace(/\r?\n    /g, '\r\n');
    }

    static remove2SpaceIndentation(input: string) {
        return input.replace(/^  /, '').replace(/\r?\n  /g, '\r\n');
    }

    static removeIndentation(input: string, len: number) {        
        const beginEx = new RegExp(`^[ ]{${len}}`);
        const linesEx = new RegExp(`\r?\n[ ]{${len}}`, 'g');
        return input.replace(beginEx, '').replace(linesEx, '\r\n');
    }
}