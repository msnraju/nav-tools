import { TokenType } from '../util/token-model';
import TokenStream from '../util/token-stream';
import IFilterCondition from '../models/filter-condition';
import ICalcFormula, { CalcFormula } from '../models/calc-formula';
import TableFiltersReader from './table-filter-reader';
import StringTokenizer from '../util/string-tokenizer';
import StringHelper from '../util/string-helper';

export default class CalcFormulaReader {
  static read(input: string): ICalcFormula {
    input = input.replace(/\r?\n[ ]*/g, ' ');

    if (input.startsWith('[')) input = StringHelper.unescapeBrackets(input);

    const tokens = StringTokenizer.tokens(input);
    return this.readCalcFormula(new TokenStream(tokens));
  }

  private static readCalcFormula(stream: TokenStream): ICalcFormula {
    let reverseSign: boolean | undefined = undefined;

    if (stream.currentTokenIs(TokenType.OPERATOR, '-')) {
      reverseSign = true;
      stream.next();
    }

    const method = stream.currentTokenValue;
    stream.ascertainAndMoveNext(TokenType.NAME);
    stream.ascertainAndMoveNext(TokenType.OPEN_PARENTHESIS);

    let table = '';
    let field = undefined;

    if (stream.currentTokenIs(TokenType.DOUBLE_QUOTED_STRING)) {
      table = stream.currentTokenValue;
      stream.next();
    } else {
      table = stream.getString([
        { type: TokenType.NAME, value: 'WHERE' },
        TokenType.PERIOD,
        TokenType.CLOSE_PARENTHESIS,
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
          TokenType.CLOSE_PARENTHESIS,
          TokenType.SEMICOLON,
        ]);
      }
    }

    let tableFilters: Array<IFilterCondition> | undefined = undefined;

    if (stream.currentTokenIs(TokenType.NAME, 'WHERE')) {
      stream.next();
      tableFilters = TableFiltersReader.read(stream);
    }

    stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);
    if (!stream.EOS) {
      stream.ascertainAndMoveNext(TokenType.SEMICOLON);
    }

    return new CalcFormula(method, reverseSign, table, field, tableFilters);
  }
}
