import { TokenType } from '../util/token-model';
import TokenStream from '../util/token-stream';
import IFilterCondition from '../models/filter-condition';
import ITableRelation, { TableRelation } from '../models/table-relation';
import TableFiltersReader from './table-filter-reader';
import StringTokenizer from '../util/string-tokenizer';
import StringHelper from '../util/string-helper';

export default class TableRelationReader {
  static read(input: string): ITableRelation {
    input = StringHelper.unescapeBrackets(input);
    input = input.replace(/\r?\n[ ]*/g, ' ');
    const tokens = StringTokenizer.tokens(input);
    return this.readTableRelation(new TokenStream(tokens));
  }

  private static readTableRelation(stream: TokenStream): ITableRelation {
    let conditions: Array<IFilterCondition> | undefined = undefined;
    if (stream.currentTokenIs(TokenType.NAME, 'IF')) {
      stream.next();
      conditions = TableFiltersReader.read(stream);
    }

    let table = '';
    let field = undefined;
    if (stream.currentTokenIs(TokenType.DOUBLE_QUOTED_STRING)) {
      table = stream.currentTokenValue;
      stream.next();
    } else {
      table = stream.getString([
        { type: TokenType.NAME, value: 'WHERE' },
        { type: TokenType.NAME, value: 'ELSE' },
        TokenType.PERIOD,
        TokenType.SEMICOLON,
      ]);
    }

    if (stream.currentTokenIs(TokenType.PERIOD)) {
      stream.next();
      if (stream.currentTokenIs(TokenType.DOUBLE_QUOTED_STRING)) {
        field = stream.currentTokenValue;
        stream.next();
      } else {
        field = stream.getString([
          { type: TokenType.NAME, value: 'WHERE' },
          { type: TokenType.NAME, value: 'ELSE' },
          TokenType.SEMICOLON,
        ]);
      }
    }

    let tableFilters: Array<IFilterCondition> | undefined = undefined;
    if (stream.currentTokenIs(TokenType.NAME, 'WHERE')) {
      stream.next();
      tableFilters = TableFiltersReader.read(stream);
    }

    let alternate = undefined;
    if (stream.currentTokenIs(TokenType.NAME, 'ELSE')) {
      stream.next();
      alternate = this.readTableRelation(stream);
    }

    if (!stream.EOS) {
      stream.ascertainAndMoveNext(TokenType.SEMICOLON);
    }

    return new TableRelation(conditions, table, field, tableFilters, alternate);
  }
}
