import StringHelper from '../util/string-helper';

export default class FieldListReader {
  static read(input: string): string[] {
    const fields = [];
    const tokens = this.tokenize(input);
    for (let i = 0; i < tokens.length; i += 2) {
      const fieldName = tokens[i].value;
      fields.push(fieldName);
    }

    return fields;
  }

  private static tokenize(input: string) {
    input = StringHelper.unescapeBrackets(input);

    const tokens = [];
    let current = 0;
    while (current < input.length) {
      let char = input[current];

      const COMMA = /,/;
      if (COMMA.test(char)) {
        tokens.push({ type: 'COMMA', value: char });
        char = input[++current];

        continue;
      }

      if (char === '"') {
        char = input[++current];
        let nextChar = current + 1 < input.length ? input[current + 1] : '';
        let value = '';
        while (
          current < input.length &&
          (char !== '"' || (char === '"' && nextChar === '"'))
        ) {
          value += char;
          if (char === '"' && nextChar === '"') current++;

          char = input[++current];
          nextChar = current + 1 < input.length ? input[current + 1] : '';
        }

        tokens.push({ type: 'STRING', value: value });
        current++;
        continue;
      }

      const LETTERS = /[^,]/i;
      if (LETTERS.test(char)) {
        let value = '';
        while (current < input.length && LETTERS.test(char)) {
          value += char;
          char = input[++current];
        }

        tokens.push({ type: 'LETTERS', value: value });
        continue;
      }

      throw new TypeError(`Invalid character ${char}`);
    }

    return tokens;
  }
}
