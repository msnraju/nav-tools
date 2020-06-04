import TokenStream from "../util/token-stream";
import StringTokenizer from "../util/string-tokenizer";
import { TokenType } from "../util/token-model";
import IBaseClass, { BaseClass } from "../models/base-class";

export interface IDataItemLink extends IBaseClass {
    field: string;
    referenceDataItem: string;
    referenceField: string;
}

export class DataItemLink extends BaseClass implements IDataItemLink {
    field: string;
    referenceDataItem: string;
    referenceField: string;

    constructor(
        field: string,
        referenceDataItem: string,
        referenceField: string
    ) {
        super('DataItemLink');

        this.field = field;
        this.referenceDataItem = referenceDataItem;
        this.referenceField = referenceField;
    }
}

export default class DataItemLinkReader {
    static read(input: string): Array<IDataItemLink> {
        const dataItemLinks: Array<IDataItemLink> = [];
        const stream = new TokenStream(StringTokenizer.tokens(input));

        while (!stream.EOS) {
            let field = '';
            let referenceDataItem = '';
            let referenceField = '';

            field = stream.getString(TokenType.EQUALS);
            stream.next();
            referenceDataItem = stream.currentTokenValue;
            stream.next();
            stream.ascertainAndMoveNext(TokenType.PERIOD);
            if (stream.currentTokenIs(TokenType.DOUBLE_QUOTED_STRING)) {
                referenceField = stream.currentTokenValue;
                stream.next();
            } else {
                referenceField = stream.getString(TokenType.COMMA);
            }

            if (stream.currentTokenIs(TokenType.COMMA))
                stream.next();

            dataItemLinks.push(new DataItemLink(field, referenceDataItem, referenceField));
        }

        return dataItemLinks;
    }
}