import IBaseClass, { BaseClass } from '../models/base-class';
import TokenStream from '../util/token-stream';
import StringTokenizer from '../util/string-tokenizer';
import { TokenType } from '../util/token-model';

export interface IOrderBy extends IBaseClass {
  column: string;
  direction: string;
}

export class OrderBy extends BaseClass implements IOrderBy {
  column: string;
  direction: string;

  constructor(column: string, direction: string) {
    super('OrderBy');

    this.column = column;
    this.direction = direction;
  }
}

export default class OrderByReader {
  static read(input: string): Array<IOrderBy> {
    const orderBy: Array<IOrderBy> = [];
    const stream = new TokenStream(StringTokenizer.tokens(input));

    while (!stream.EOS) {
      const column = stream.currentTokenValue;
      stream.next();

      stream.ascertainAndMoveNext(TokenType.EQUALS);

      const direction = stream.currentTokenValue;
      stream.next();

      if (stream.currentTokenIs(TokenType.COMMA)) stream.next();

      orderBy.push(new OrderBy(column, direction));
    }

    return orderBy;
  }
}
