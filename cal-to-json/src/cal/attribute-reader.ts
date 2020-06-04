import IBaseClass, { BaseClass } from '../models/base-class';
import StringHelper from '../util/string-helper';

export interface IAttribute extends IBaseClass {
  type: string;
}

export class Attribute extends BaseClass implements IAttribute {
  type: string;

  constructor(type: string) {
    super('Attribute');
    this.type = type;
  }
}

export interface IIntegrationAttribute extends IAttribute {
  includeSender: boolean;
  globalVarAccess: boolean;
}

export class IntegrationAttribute extends Attribute
  implements IIntegrationAttribute {
  includeSender: boolean;
  globalVarAccess: boolean;

  constructor(includeSender: boolean, globalVarAccess: boolean) {
    super('Integration');

    this.includeSender = includeSender;
    this.globalVarAccess = globalVarAccess;
  }
}

export interface IBusinessAttribute extends IAttribute {
  includeSender: boolean;
}

export class BusinessAttribute extends Attribute implements IBusinessAttribute {
  includeSender: boolean;

  constructor(includeSender: boolean) {
    super('Business');

    this.includeSender = includeSender;
  }
}

export interface IEventSubscriberAttribute extends IAttribute {
  publisherObjectType: string;
  publisherObjectId: number;
  eventFunction: string;
  publisherElement: string;
  onMissingLicense: string;
  onMissingPermission: string;
}

export class EventSubscriberAttribute extends Attribute {
  publisherObjectType: string;
  publisherObjectId: number;
  eventFunction: string;
  publisherElement: string;
  onMissingLicense: string;
  onMissingPermission: string;

  constructor(
    publisherObjectType: string,
    publisherObjectId: number,
    eventFunction: string,
    publisherElement: string,
    onMissingLicense: string,
    onMissingPermission: string
  ) {
    super('EventSubscriber');
    this.publisherObjectType = publisherObjectType;
    this.publisherObjectId = publisherObjectId;
    this.eventFunction = eventFunction;
    this.publisherElement = publisherElement;
    this.onMissingLicense = onMissingLicense;
    this.onMissingPermission = onMissingPermission;
  }
}

export default class AttributeReader {
  static readMultiple(input: string): Array<IAttribute> | undefined {
    let attributes: Array<IAttribute> | undefined = undefined;
    if (!input) return attributes;

    const ATTRIBUTE_EXPR = /\[(\w*)(\((.*)\))?\]/g;
    if (!ATTRIBUTE_EXPR.test(input))
      throw new Error(`Invalid attribute: ${input}`);

    const lines = input.match(ATTRIBUTE_EXPR);
    if (!lines) throw new Error(`Invalid attribute: ${input}`);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      attributes = attributes || [];
      attributes.push(this.read(line));
    }

    return attributes;
  }

  private static read(input: string): IAttribute {
    const ATTRIBUTE_EXPR = /\[(\w*)(\((.*)\))?\]/;
    let match = ATTRIBUTE_EXPR.exec(input);
    if (!match) throw new Error(`Invalid attribute: ${input}`);
    const type = match[1];
    const params = match[3] || '';
    switch (type) {
      case 'Integration':
        let includeSender = false;
        let globalVarAccess = false;
        if (params) {
          match = /(\w*)(,(\w*))?/.exec(params);
          if (!match) throw new Error(`Invalid attribute: ${input}`);
          includeSender = match[1] === 'TRUE';
          globalVarAccess = match[3] === 'TRUE';
        }

        return new IntegrationAttribute(includeSender, globalVarAccess);
      case 'Business':
        let includeSender2 = false;
        if (params) {
          match = /(\w*)?/.exec(params);
          if (!match) throw new Error(`Invalid attribute: ${input}`);
          includeSender2 = match[1] === 'TRUE';
        }
        return new BusinessAttribute(includeSender2);
      case 'EventSubscriber':
        let publisherObjectType = '';
        let publisherObjectId = 0;
        let eventFunction = '';
        let publisherElement = '';
        let onMissingLicense = '';
        let onMissingPermission = '';
        if (params) {
          match = /(\w*),(\d*),(".*"|\w*)(,(".*"|\w*))?(,(\w*))?(,(\w*))?/.exec(
            params
          );
          if (!match) throw new Error(`Invalid attribute: ${input}`);
          publisherObjectType = match[1];
          publisherObjectId = Number(match[2] || 0);
          eventFunction = StringHelper.unescapeDoubleQuoteString(match[3]);
          publisherElement = StringHelper.unescapeDoubleQuoteString(
            match[5] || ''
          );
          onMissingLicense = match[7] || '';
          onMissingPermission = match[9] || '';
        }

        return new EventSubscriberAttribute(
          publisherObjectType,
          publisherObjectId,
          eventFunction,
          publisherElement,
          onMissingLicense,
          onMissingPermission
        );
      case 'TryFunction':
      case 'External':
      case 'Internal':
      case 'Test':
      case 'ServiceEnabled':
        if (params) throw new Error(`Invalid attribute: ${input}`);

        return new Attribute(type);
      default:
        throw new Error(`Invalid attribute: ${input}`);
    }
  }
}
