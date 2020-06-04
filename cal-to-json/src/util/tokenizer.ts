import IToken, { TokenType } from './token-model';

export default class Tokenizer {
  tokens(input: string): IToken[] {
    let tokens: IToken[] = [];
    let current = 0;

    while (current < input.length) {
      let char = input[current];

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

        while (WHITESPACE.test(char)) {
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

      let OPERATOR = /[+\-/*%^]/i;
      if (OPERATOR.test(char)) {
        let value = '';

        while (OPERATOR.test(char)) {
          value += char;
          char = input[++current];
        }

        tokens.push({ type: TokenType.OPERATOR, value });

        continue;
      }

      let SYMBOL = /[@#]/;
      if (SYMBOL.test(char)) {
        tokens.push({ type: TokenType.SYMBOL, value: char });

        current++;
        continue;
      }

      if (char === '"') {
        let value = '';
        char = input[++current];

        while (char !== '"') {
          value += char;
          char = input[++current];
        }

        char = input[++current];

        tokens.push({ type: TokenType.DOUBLE_QUOTED_STRING, value });

        continue;
      }

      if (char === "'") {
        let value = '';
        char = input[++current];

        while (char !== "'" && input[current] !== "'") {
          value += char;
          char = input[++current];
        }

        char = input[++current];

        tokens.push({ type: TokenType.SINGLE_QUOTED_STRING, value });

        continue;
      }

      let NUMBERS = /[0-9]/;
      if (NUMBERS.test(char)) {
        let value = '';
        NUMBERS = /[0-9.]/;
        while (NUMBERS.test(char)) {
          value += char;
          char = input[++current];
        }

        tokens.push({ type: TokenType.NUMBER, value });

        continue;
      }

      let LETTERS = /[a-z]/i;
      if (LETTERS.test(char)) {
        let value = '';
        LETTERS = /[a-z0-9]/i;
        while (LETTERS.test(char)) {
          value += char;
          char = input[++current];
        }

        tokens.push({ type: TokenType.NAME, value });

        continue;
      }

      throw new TypeError(`Invalid character'${char}' at ${current}`);
    }

    return tokens;
  }
}
