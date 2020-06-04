import StringHelper from '../util/string-helper';
import TableReader from './table-reader';
import PropertyReader from './property-reader';
import PropertyMap from './property-map';
import ReportReader from './report-reader';
import PageReader from './page-reader';
import XMLportReader from './xml-port-reader';
import QueryReader from './query-reader';
import MenuSuiteReader from './menu-suite-reader';
import CodeunitReader from './code-unit-reader';
import CodeSegmentReader from './code-segment-reader';
import StringBuffer from '../util/string-buffer';
import LineByLine from 'n-readlines';

export interface IAppObject {
  type: string;
  id: string;
  name: string;
  [name: string]: any;
}

export interface ISegment {
  name: string;
  body: any;
}

type ReadObjectsCallback = (object: IAppObject, content: string) => void;

export default class ObjectReader {
  static readObjects(
    objectFile: string,
    onObject: ReadObjectsCallback | null = null
  ): Array<IAppObject> {
    const objects: Array<IAppObject> = [];

    // OBJECT Table 3 Payment Terms
    const headerExpr = /OBJECT \[?(\w*) (\d*) (.*)\]?/;
    let buffer: Buffer | false;
    let objectBuffer: StringBuffer | null = null;
    const liner = new LineByLine(objectFile);
    let stage: 'CLOSED' | 'OPEN' = 'CLOSED';

    while ((buffer = liner.next())) {
      const line = buffer.toString('utf-8');

      switch (stage) {
        case 'CLOSED':
          if (line[0] === '\r') {
            continue;
          }

          const match = headerExpr.exec(line);
          if (!match) {
            throw new Error(`Invalid file header: '${line}'`);
          }

          stage = 'OPEN';
          objectBuffer = new StringBuffer();
          break;
        case 'OPEN':
          if (line.substring(0, 1) === '}') {
            stage = 'CLOSED';
          }

          break;
      }

      if (objectBuffer) {
        objectBuffer.append(line);

        if (stage === 'CLOSED') {
          const content = objectBuffer.toString();
          const appObject = this.readObject(content);
          objects.push(appObject);

          if (onObject) {
            onObject(appObject, content);
          }

          objectBuffer = null;
        }
      }
    }

    return objects;
  }

  static readObject(content: string): IAppObject {
    const OBJECT_HEADER_BODY_EXPR = /(.*)(\r?\n\{)((\r?\n.*)*?)(\r?\n\})/;

    if (!OBJECT_HEADER_BODY_EXPR.test(content)) {
      throw new Error('object header error');
    }

    let match = OBJECT_HEADER_BODY_EXPR.exec(content);
    if (!match) throw new Error('object header error');

    const appObject = this.getObjectHeader(match[1]);
    console.log(
      `Type: ${appObject.type}, ID: ${appObject.id}, Name: ${appObject.name}`
    );

    const body = match[3];
    const segments = ObjectReader.splitSegments(appObject.type, body);
    segments.forEach(segment => {
      appObject[segment.name] = segment.body;
    });

    // for (let i = 0; i < segments.length; i++) {
    //   appObject.segments.push(segments[i]);
    // }

    return appObject;
  }

  static splitSegments(objectType: string, input: string) {
    const SEGMENTS_HEADER_BODY_EXPR = /\r?\n {2}\}|\r?\n {2}\{/;

    const bodySplit = input.split(SEGMENTS_HEADER_BODY_EXPR);
    const segments = [];
    for (let i = 0; i < bodySplit.length - 1; i += 2) {
      let segment: any = null;

      const name = bodySplit[i].trim();
      const text = bodySplit[i + 1];
      switch (name) {
        case 'OBJECT-PROPERTIES':
          segment = PropertyReader.read(text, PropertyMap.objectProperties);
          break;
        case 'CODE':
          segment = CodeSegmentReader.read(text);
          break;
        default:
          segment = ObjectReader.readSegment(objectType, name, text);
      }

      segments.push({ name: name, body: segment });
    }

    return segments;
  }

  private static readSegment(objectType: string, name: string, input: string) {
    switch (objectType) {
      case 'Table':
        return TableReader.readSegment(name, input);
      case 'Report':
        return ReportReader.readSegment(name, input);
      case 'Page':
        return PageReader.readSegment(name, input);
      case 'XMLport':
        return XMLportReader.readSegment(name, input);
      case 'Query':
        return QueryReader.readSegment(name, input);
      case 'MenuSuite':
        return MenuSuiteReader.readSegment(name, input);
      case 'Codeunit':
        return CodeunitReader.readSegment(name, input);
      default:
        throw new TypeError(
          `Not implemented. Object Type: '${objectType}', Segment: '${name}'`
        );
    }
  }

  static getObjectHeader(input: string): IAppObject {
    const OBJECT_SIG_EXPR = /OBJECT (.*)/;
    const OBJECT_HEADER_EXPR = /(\w*) (\d*) (.*)/;

    if (!OBJECT_SIG_EXPR.test(input))
      throw new Error(`Invalid object header '${input}'`);

    let match = /OBJECT (.*)/.exec(input);
    if (!match) throw new Error(`Invalid object header '${input}'`);

    let header = StringHelper.unescapeBrackets(match[1]);
    if (!OBJECT_HEADER_EXPR.test(header))
      throw new Error(`Invalid object header '${header}'`);

    match = OBJECT_HEADER_EXPR.exec(header);
    if (!match) throw new Error(`Invalid object header '${header}'`);

    return { type: match[1], id: match[2], name: match[3] };
  }
}
