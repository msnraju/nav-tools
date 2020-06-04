import PropertyReader from "./property-reader";

import PropertyMap from "./property-map";

export default class CodeunitReader {
    static readSegment(name: string, input: string) {
        switch (name) {
            case 'PROPERTIES':
                return PropertyReader.read(input, PropertyMap.codeunitProperties);
            default:
                throw new TypeError(`Invalid segment type'${name}'`);
        }
    }

}