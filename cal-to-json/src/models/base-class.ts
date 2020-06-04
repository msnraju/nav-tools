export default interface IBaseClass {
    className: string;
}

export abstract class BaseClass implements IBaseClass {
    className: string;

    constructor(className: string) {
        this.className = className;
    }
}
