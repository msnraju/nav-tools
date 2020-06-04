import { IProcedure } from "./procedure";
import { IParameter } from "./parameter";
import { IReturnType } from "./return-type";
import { IAttribute } from "../cal/attribute-reader";
import { IVariable } from "../cal/variable-reader";
import { BaseClass } from "./base-class";

export interface IEvent extends IProcedure {
    eventVariable: string;
    eventVariableId: number;
}

export class Event extends BaseClass implements IEvent {
    eventVariable: string;
    eventVariableId: number;

    local: boolean | undefined;
    id: number;
    name: string;

    attributes: Array<IAttribute> | undefined;
    parameters: Array<IParameter> | undefined;
    returns: IReturnType | undefined;
    variables: Array<IVariable> | undefined;
    body: any;

    constructor(
        eventVariable: string,
        eventVariableId: number,

        local: boolean | undefined,
        id: number,
        name: string,

        attributes: Array<IAttribute> | undefined,
        parameters: Array<IParameter> | undefined,
        returns: IReturnType | undefined,
        variables: Array<IVariable> | undefined,
        body: any
    ) {
        super('Event');
        this.eventVariable = eventVariable;
        this.eventVariableId = eventVariableId;

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
