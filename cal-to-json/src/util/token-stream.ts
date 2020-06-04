import IToken, { TokenType } from './token-model';
import { isArray } from 'util';
import StringHelper from './string-helper';

export default class TokenStream {
  private tokens: IToken[];
  private index: number;

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.index = 0;
  }

  peek() {
    let i = 1;
    while (this.index + i < this.tokens.length) {
      let token = this.tokens[this.index + i];
      if (token.type === TokenType.SPACE || token.type === TokenType.LINE_BREAK)
        i++;
      else return token;
    }

    throw new Error('err');
  }

  next2(): IToken {
    return this.tokens[++this.index];
  }

  next(): IToken {
    let token: IToken = this.next2();
    while (
      token &&
      (token.type === TokenType.COMMENT ||
        token.type === TokenType.SPACE ||
        token.type === TokenType.LINE_BREAK)
    ) {
      token = this.next2();
    }

    return token;
  }

  current(): IToken {
    return this.tokens[this.index];
  }

  print(count: number) {
    for (let i = 0; i < count && this.index + i < this.tokens.length; i++) {
      console.log(this.tokens[this.index + i]);
    }
  }

  ignoreSpacesOnly() {
    let token: IToken = this.current();
    while (token.type === TokenType.SPACE) {
      token = this.next2();
    }
  }

  ignoreSpaces() {
    let token: IToken = this.current();
    while (
      token.type === TokenType.SPACE ||
      token.type === TokenType.LINE_BREAK
    ) {
      token = this.next();
    }
  }

  matchTypePattern(types: TokenType[]) {
    if (this.tokens.length < types.length + this.index) {
      return false;
    }

    for (var i = 0; i < types.length; i++) {
      if (this.tokens[this.index + i].type !== types[i]) return false;
    }

    return true;
  }

  ascertain(type: TokenType, value: string) {
    const token = this.current();
    if (token.type !== type) {
      throw new TypeError(
        `token should be of type '${type}' but '${token.type}' found.`
      );
    }

    if (token.value !== value) {
      throw new TypeError(
        `token value should be '${value}' but '${token.value}' found.`
      );
    }
  }

  ascertainAndMoveNext(type: TokenType, value: string | null = null): IToken {
    const token = this.current();
    if (!token) {
      throw new Error('Null token reference');
    }

    if (token.type !== type) {
      throw new TypeError(
        `token should be of type '${type}' but '${token.type}' found.`
      );
    }

    if (value !== null && token.value !== value) {
      throw new TypeError(
        `token value should be '${value}' but '${token.value}' found.`
      );
    }

    return this.next();
  }

  ascertainType(type: TokenType) {
    const token = this.current();
    if (token.type !== type) {
      throw new TypeError(
        `token should be of type '${type}' but '${token.type}' found.`
      );
    }
  }

  getName() {
    this.ascertainType(TokenType.NAME);
    let token = this.current();
    const value = token.value;
    this.next();
    return value;
  }

  getNumber() {
    this.ascertainType(TokenType.NUMBER);
    let token = this.current();
    const value = token.value;
    this.next();
    return value;
  }

  getString(
    delimiter: TokenType | IToken | Array<IToken | TokenType>,
    errorOnEOS: boolean = false
  ) {
    let returnValue = '';
    let token = this.current();
    let parenthesis = 0;

    function isEqual(
      token: IToken,
      type: TokenType,
      value: string | null = null
    ) {
      let ok = token.type === type && (value === null || token.value === value);

      if (type === TokenType.CLOSE_PARENTHESIS) {
        if (token.type === TokenType.OPEN_PARENTHESIS) parenthesis += 1;
        else if (token.type === TokenType.CLOSE_PARENTHESIS) {
          parenthesis -= 1;
          ok = ok && parenthesis === -1;
        }
      }

      return ok;
    }

    function isDelimiter(token: IToken) {
      if (isArray(delimiter)) {
        for (let i = 0; i < delimiter.length; i++) {
          const current = delimiter[i];
          if ((current as IToken).type) {
            let delimiter2 = current as IToken;
            if (isEqual(token, delimiter2.type, delimiter2.value)) return true;
          } else {
            if (isEqual(token, current as TokenType)) return true;
          }
        }
      } else if ((delimiter as IToken).type) {
        let delimiter2 = delimiter as IToken;
        return isEqual(token, delimiter2.type, delimiter2.value);
      } else {
        return isEqual(token, delimiter as TokenType);
      }

      return false;
    }

    while (token && !isDelimiter(token)) {
      if (token.type === TokenType.DOUBLE_QUOTED_STRING)
        returnValue += `"${StringHelper.escapeDoubleQuoteString(token.value)}"`;
      else if (token.type === TokenType.SINGLE_QUOTED_STRING)
        returnValue += `'${StringHelper.escapeSingleQuoteString(token.value)}'`;
      else returnValue += token.value;

      token = this.next2();
    }

    if (errorOnEOS && !token) throw new Error(`End of stream reached.`);

    return returnValue;
  }

  currentTokenIs(type: TokenType, value: string | null = null): boolean {
    const token = this.current();
    if (
      token &&
      token.type === type &&
      (token.value === value || value === null)
    )
      return true;

    return false;
  }

  get currentTokenValue() {
    return this.current()?.value;
  }

  get currentTokenType() {
    return this.current()?.type;
  }

  get EOS() {
    return this.tokens.length <= this.index;
  }
}
