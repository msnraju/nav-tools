import StringTokenizer from "../util/string-tokenizer";
import ITableView, { TableView } from "../models/table-view";
import TokenStream from "../util/token-stream";
import { TokenType } from "../util/token-model";
import IFilterCondition from "../models/filter-condition";
import TableFiltersReader from "./table-filter-reader";
import StringHelper from "../util/string-helper";

export default class TableViewReader {
    static read(input: string): ITableView {
        input = StringHelper.unescapeBrackets(input);
        const tokens = StringTokenizer.tokens(input);
        const stream = new TokenStream(tokens);
        return this.readTableView(stream);
    }

    static readTableView(stream: TokenStream): ITableView {
        let key: Array<string> | null = null;
        let order: string | null = null;
        let tableFilter: Array<IFilterCondition> | null = null;

        if (stream.currentTokenIs(TokenType.NAME, 'SORTING')) {
            stream.next();

            key = [];
            stream.ascertainAndMoveNext(TokenType.OPEN_PARENTHESIS);
            while (!stream.currentTokenIs(TokenType.CLOSE_PARENTHESIS)) {
                const field = stream.getString([TokenType.COMMA, TokenType.CLOSE_PARENTHESIS]);
                key.push(field);

                if (stream.currentTokenIs(TokenType.COMMA))
                    stream.next();
            }

            stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);
        }

        if (stream.currentTokenIs(TokenType.NAME, 'ORDER')) {
            stream.next();
            stream.ascertainAndMoveNext(TokenType.OPEN_PARENTHESIS);
            order = stream.currentTokenValue;
            stream.next();

            stream.ascertainAndMoveNext(TokenType.CLOSE_PARENTHESIS);
        }

        if (stream.currentTokenIs(TokenType.NAME, 'WHERE')) {
            stream.next();
            tableFilter = TableFiltersReader.read(stream);
        }

        if (!stream.EOS) {
            stream.ascertainAndMoveNext(TokenType.SEMICOLON);
        }

        return new TableView(key, order, tableFilter);
    }
}