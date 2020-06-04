import StringHelper from '../util/string-helper';
import ILangText from '../models/lang-text';
import TextMLReader from './text-ml-reader';

export default class TextConstantReader {
  static read(input: string): Array<ILangText> {
    input = StringHelper.unescapeSingleQuoteString(input);
    return TextMLReader.read(input);
  }
}
