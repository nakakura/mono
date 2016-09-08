/// <reference path="../../typings/index.d.ts" />

export interface LocationIf {

    store(cb: (err: Error, rows: any[], fields: any[]) => void): void;
}

export interface MySqlIf{
    query(sql: string, cb: (err: Error, rows: any[], fields: any[]) => void, items?: Array<any>): void;
}

export let TYPES = {
    MySqlIf: Symbol("MySqlIf"),
    LocationIf: Symbol("LocationIf")
};