import StringHelper from "../util/string-helper";
import ILangText, { LangText } from "../models/lang-text";
import IToken, { TokenType } from "../util/token-model";
import StringTokenizer from "../util/string-tokenizer";
import TokenStream from "../util/token-stream";

export default class TextMLReader {
    static read(input: string): Array<ILangText> {
        input = StringHelper.unescapeBrackets(input);
        const captionML = [];
        const stream = new TokenStream(StringTokenizer.tokens(input));
        while (!stream.EOS) {
            let lang = '';
            if (stream.currentTokenIs(TokenType.NAME)) {
                lang = stream.currentTokenValue;
                stream.next();
            } else {
                lang = stream.getString(TokenType.EQUALS);
            }
            
            stream.ascertainAndMoveNext(TokenType.EQUALS);

            let text = '';
            if (stream.currentTokenIs(TokenType.DOUBLE_QUOTED_STRING)) {
                text = stream.currentTokenValue;
                stream.next();
            } else {
                text = stream.getString(TokenType.SEMICOLON);
            }

            if (!stream.EOS)
                stream.ascertainAndMoveNext(TokenType.SEMICOLON);

            captionML.push(new LangText(lang, text));
        }

        return captionML;
    }

    static captionMLTokenize(input: string): Array<IToken> {
        input = StringHelper.unescapeBrackets(input);

        const tokens: Array<IToken> = [];
        let current = 0;
        while (current < input.length) {
            let char = input[current];

            const OPEN_BRACKET = /\[/;
            if (OPEN_BRACKET.test(char)) {
                tokens.push({ type: TokenType.OPEN_BRACKET, value: char });
                current++;
                continue;
            }

            const CLOSING_BRACKET = /\]/;
            if (CLOSING_BRACKET.test(char)) {
                tokens.push({ type: TokenType.CLOSE_BRACKET, value: char });
                current++;
                continue;
            }

            const EQUALS = /=/;
            if (EQUALS.test(char)) {
                tokens.push({ type: TokenType.EQUALS, value: char });
                current++;
                continue;
            }

            const SEMICOLON = /;/;
            if (SEMICOLON.test(char)) {
                tokens.push({ type: TokenType.SEMICOLON, value: char });
                char = input[++current];

                const SPACES = /\s/;
                if (SPACES.test(char)) {
                    while (SPACES.test(char)) {
                        char = input[++current];
                    }
                }

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

            const LETTERS = /[^;^=]/i;
            if (LETTERS.test(char)) {
                let value = '';
                while (current < input.length && LETTERS.test(char)) {
                    value += char;
                    char = input[++current];
                }

                tokens.push({ type: TokenType.NAME, value: value });
                continue;
            }

            throw new TypeError(`Invalid character ${char}`);
        }

        return tokens;
    }
} 