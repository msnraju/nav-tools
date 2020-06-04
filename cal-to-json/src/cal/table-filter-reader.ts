import TokenStream from '../util/token-stream';
import IFilterCondition, { FilterCondition } from '../models/filter-condition';
import { TokenType } from '../util/token-model';
import StringTokenizer from '../util/string-tokenizer';

export default class TableFiltersReader {
  static readFilters(input: string): Array<IFilterCondition> {
    const stream: TokenStream = new TokenStream(StringTokenizer.tokens(input));
    const tableFilters = this.read(stream);
    if (!stream.EOS) throw new Error(`Invalid Table Filters string '${input}'`);

    return tableFilters;
  }

  static read(stream: TokenStream): Array<IFilterCondition> {
    const tableFilters: Array<IFilterCondition> = [];

    let parenthesis = false;
    if (stream.currentTokenIs(TokenType.OPEN_PARENTHESIS)) {
      parenthesis = true;
      stream.next();
    }

    while (!stream.EOS && !stream.currentTokenIs(TokenType.CLOSE_PARENTHESIS)) {
      let field = '';
      if (stream.currentTokenIs(TokenType.DOUBLE_QUOTED_STRING)) {
        field = stream.currentTokenValue;
        stream.next();
      } else field = stream.getString(TokenType.EQUALS);

      stream.ascertainAndMoveNext(TokenType.EQUALS);
      stream.ascertainType(TokenType.NAME);
      const filterType = stream.currentTokenValue;
      stream.next();

      let { upperLimit, filter, value } = TableFiltersReader.FilterValue(
        stream
      );

      if (stream.currentTokenIs(TokenType.COMMA)) stream.next();
      tableFilters.push(
        new FilterCondition(field, filterType, value, upperLimit, filter)
      );
    }

    if (parenthesis) stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);

    return tableFilters;
  }

  private static FilterValue(stream: TokenStream) {
    stream.ascertainAndMoveNext(TokenType.OPEN_PARENTHESIS);
    let upperLimit = undefined;
    let filter = undefined;

    if (stream.currentTokenIs(TokenType.NAME, 'UPPERLIMIT')) {
      stream.next();
      upperLimit = true;
      stream.ascertainAndMoveNext(TokenType.OPEN_PARENTHESIS);
    }

    if (stream.currentTokenIs(TokenType.NAME, 'FILTER')) {
      stream.next();
      filter = true;
      stream.ascertainAndMoveNext(TokenType.OPEN_PARENTHESIS);
    }

    let value = stream.getString(TokenType.CLOSE_PARENTHESIS);

    if (upperLimit) stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);

    if (filter) stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);

    stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);
    return { upperLimit, filter, value };
  }
}
