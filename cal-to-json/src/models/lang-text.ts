import IBaseClass, { BaseClass } from './base-class';

export default interface ILangText extends IBaseClass {
  lang: string;
  text: string;
}

export class LangText extends BaseClass implements ILangText {
  lang: string;
  text: string;

  constructor(lang: string, text: string) {
    super('LangText');
    this.lang = lang;
    this.text = text;
  }
}
