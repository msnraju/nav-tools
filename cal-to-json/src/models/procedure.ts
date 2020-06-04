import { IVariable } from "../cal/variable-reader";
import IBaseClass, { BaseClass } from "./base-class";
import { IAttribute } from "../cal/attribute-reader";
import { IReturnType } from "./return-type";
import { IParameter } from "./parameter";

export interface IProcedure extends IBaseClass {
    local: boolean | undefined;
    id: number;
    name: string;
    attributes: Array<IAttribute> | undefined;
    parameters: Array<IParameter> | undefined;
    returns: IReturnType | undefined;
    variables: Array<IVariable> | undefined;
    body: any;
}

export class Procedure extends BaseClass implements IProcedure {
    local: boolean | undefined;
    id: number;
    name: string;

    attributes: Array<IAttribute> | undefined;
    parameters: Array<IParameter> | undefined;
    returns: IReturnType | undefined;
    variables: Array<IVariable> | undefined;
    body: any;

    constructor(
        local: boolean | undefined,
        id: number,
        name: string,

        attributes: Array<IAttribute> | undefined,
        parameters: Array<IParameter> | undefined,
        returns: IReturnType | undefined,
        variables: Array<IVariable> | undefined,
        body: any
    ) {
        super('Procedure');
        this.local = local;
        this.id = id;
        this.name = name;
        this.attributes = attributes;
        this.parameters = parameters;
        this.returns = returns;
        this.variables = variables;
        this.body = body;
    }
}

