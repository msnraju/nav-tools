import IToken, { TokenType } from "./token-model";

export default class StringTokenizer {
    static tokens(input: string, calMode: boolean = false): IToken[] {
        let tokens: IToken[] = [];
        let current = 0;

        while (current < input.length) {
            let char = input[current];

            if (calMode) {
                let nextChar = current + 1 < input.length ? input[current + 1] : '';
                if (char == '.') {
                    if (nextChar == '.') {
                        let value = char + nextChar;
                        tokens.push({ type: TokenType.RANGE, value: value });
                        current += 2;
                        continue;
                    }
                } else if (char == ':') {
                    if (nextChar == '=') {
                        let value = char + nextChar;
                        tokens.push({ type: TokenType.ASSIGNMENT, value: value });
                        current += 2;
                        continue;
                    } else if (nextChar == ':') {
                        let value = char + nextChar;
                        tokens.push({ type: TokenType.OPTION_VALUE_SEPARATOR, value: value });
                        current += 2;
                        continue;
                    }
                } else if (char == '=') {
                    tokens.push({ type: TokenType.OPERATOR, value: char });
                    current++;
                    continue;
                } else if (char == '<') {
                    if (nextChar == '=' || nextChar == '>') {
                        let value = char + nextChar;
                        tokens.push({ type: TokenType.OPERATOR, value: value });
                        current += 2;
                    } else {
                        tokens.push({ type: TokenType.OPERATOR, value: char });
                        current++;
                    }

                    continue;
                } else if (char == '>') {
                    if (nextChar == '=') {
                        let value = char + nextChar;
                        tokens.push({ type: TokenType.OPERATOR, value: value });
                        current += 2;
                    } else {
                        tokens.push({ type: TokenType.OPERATOR, value: char });
                        current++;
                    }

                    continue;
                } else if (/[-+/*]/.test(char)) {
                    if (char == '/' && nextChar == '/') {
                        let value = char + nextChar;
                        value = '';
                        while (!/[\r\n]/.test(char)) {
                            value += char;
                            char = input[++current];
                        }

                        tokens.push({ type: TokenType.COMMENT, value: value });
                        continue;
                    }

                    if ((char == '+' || char == '-' || char == '*' || char == '/') && nextChar == '=') {
                        let value = char + nextChar;
                        tokens.push({ type: TokenType.ASSIGNMENT, value: value });
                        current += 2;
                        continue;
                    }

                    if (char == '-' && /[0-9]/.test(nextChar)) {
                        let value = '';

                        while (/[-0-9.]/.test(char)) {
                            value += char;
                            char = input[++current];
                            nextChar = current + 1 < input.length ? input[current + 1] : '';
                        }

                        tokens.push({ type: TokenType.NUMBER, value: value });
                        continue;
                    }

                    tokens.push({ type: TokenType.OPERATOR, value: char });
                    current++;
                    continue;
                }
            }

            let NEWLINE = /[\r\n]/;
            if (NEWLINE.test(char)) {
                let value = '';

                while (NEWLINE.test(char)) {
                    value += char;
                    char = input[++current];
                }

                tokens.push({ type: TokenType.LINE_BREAK, value });
                continue;
            }

            let WHITESPACE = /\s/;
            if (WHITESPACE.test(char)) {
                let value = '';

                while (current < input.length && WHITESPACE.test(char)) {
                    value += char;
                    char = input[++current];
                }

                tokens.push({ type: TokenType.SPACE, value });
                continue;
            }

            let SEMICOLON = /;/;
            if (SEMICOLON.test(char)) {
                tokens.push({ type: TokenType.SEMICOLON, value: char });

                current++;
                continue;
            }

            let COMMA = /,/;
            if (COMMA.test(char)) {
                tokens.push({ type: TokenType.COMMA, value: char });

                current++;
                continue;
            }

            let PERIOD = /\./;
            if (PERIOD.test(char)) {
                tokens.push({ type: TokenType.PERIOD, value: char });

                current++;
                continue;
            }

            let PUNCTUATION = /[:!]/i;
            if (PUNCTUATION.test(char)) {
                tokens.push({ type: TokenType.PUNCTUATION, value: char });

                current++;
                continue;
            }

            let OPEN_BRACKETS = /\[/;
            if (OPEN_BRACKETS.test(char)) {
                tokens.push({ type: TokenType.OPEN_BRACKET, value: char });

                current++;
                continue;
            }

            let CLOSE_BRACKET = /\]/;
            if (CLOSE_BRACKET.test(char)) {
                tokens.push({ type: TokenType.CLOSE_BRACKET, value: char });

                current++;
                continue;
            }

            let OPEN_BRACES = /\{/;
            if (OPEN_BRACES.test(char)) {
                tokens.push({ type: TokenType.OPEN_BRACES, value: char });

                current++;
                continue;
            }

            let CLOSE_BRACES = /\}/;
            if (CLOSE_BRACES.test(char)) {
                tokens.push({ type: TokenType.CLOSE_BRACES, value: char });

                current++;
                continue;
            }

            let OPEN_PARENTHESES = /\(/;
            if (OPEN_PARENTHESES.test(char)) {
                tokens.push({ type: TokenType.OPEN_PARENTHESIS, value: char });

                current++;
                continue;
            }

            let CLOSE_PARENTHESIS = /\)/;
            if (CLOSE_PARENTHESIS.test(char)) {
                tokens.push({ type: TokenType.CLOSE_PARENTHESIS, value: char });

                current++;
                continue;
            }

            let EQUALS = /=/;
            if (EQUALS.test(char)) {
                tokens.push({ type: TokenType.EQUALS, value: char });

                current++;
                continue;
            }

            let AT_SYMBOL = /@/;
            if (AT_SYMBOL.test(char)) {
                tokens.push({ type: TokenType.AT_SYMBOL, value: char });

                current++;
                continue;
            }

            let OPERATOR = /[+-/*]/;
            if (OPERATOR.test(char)) {
                let value = '';

                while (current < input.length && OPERATOR.test(char)) {
                    value += char;
                    char = input[++current];
                }

                tokens.push({ type: TokenType.OPERATOR, value });

                continue;
            }


            let SYMBOL = /[#|<>?&$%^]/;
            if (SYMBOL.test(char)) {
                tokens.push({ type: TokenType.SYMBOL, value: char });

                current++;
                continue;
            }

            if (char == '"') {
                char = input[++current];
                let nextChar = current + 1 < input.length ? input[current + 1] : '';
                let value = '';
                while ((current < input.length) && (char != '"' || (char == '"' && nextChar == '"'))) {
                    value += char;
                    if (char == '"' && nextChar == '"') current++;

                    char = input[++current];
                    nextChar = current + 1 < input.length ? input[current + 1] : '';
                }

                tokens.push({ type: TokenType.DOUBLE_QUOTED_STRING, value: value });
                current++;
                continue;
            }

            if (char == '\'') {
                char = input[++current];
                let nextChar = current + 1 < input.length ? input[current + 1] : '';
                let value = '';
                while ((current < input.length) && (char != '\'' || (char == '\'' && nextChar == '\''))) {
                    value += char;
                    if (char == '\'' && nextChar == '\'') current++;

                    char = input[++current];
                    nextChar = current + 1 < input.length ? input[current + 1] : '';
                }

                tokens.push({ type: TokenType.SINGLE_QUOTED_STRING, value: value });
                current++;
                continue;
            }

            let NUMBERS = /[0-9]/;
            if (NUMBERS.test(char)) {
                let value = '';
                NUMBERS = /[0-9.]/;
                while (current < input.length && NUMBERS.test(char)) {
                    value += char;
                    char = input[++current];
                }

                const NUMBER_EXPR = /^([+-]?\d*.\d+|[+-]?\d*)$/;
                if (NUMBER_EXPR.test(value))
                    tokens.push({ type: TokenType.NUMBER, value });
                else {
                    const match = /^([+-]?\d*.\d+|[+-]?\d*)(.*)/.exec(value);
                    if (!match) throw new Error('Invalid expression');
                    current -= match[2].length;
                    value = match[1];
                    tokens.push({ type: TokenType.NUMBER, value });
                }

                continue;
            }

            let LETTERS = /[_a-z]/i;
            if (LETTERS.test(char)) {
                let value = '';
                LETTERS = /[a-z0-9_]/i;
                while (current < input.length && LETTERS.test(char)) {
                    value += char;
                    char = input[++current];
                }

                tokens.push({ type: TokenType.NAME, value });

                continue;
            }

            tokens.push({ type: TokenType.SYMBOL, value: char })
            current++;
        }

        return tokens;
    }
}