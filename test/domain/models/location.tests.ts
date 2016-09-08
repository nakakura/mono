/// <reference path="../../../typings/index.d.ts"/>
//test libraries
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon: any;

//test targets
import {Location} from '../../../src/domain/models/location';
import "reflect-metadata";
import {decorate, injectable, inject, interfaces } from "inversify";
import {TYPES, MySqlIf} from "../../../src/bindings/entities";
import {kernel} from "../../../src/bindings/inversify_initialize";

describe('Location', () => {
    before(() => {
        kernel.bind<MySqlIf>(TYPES.MySqlIf).toDynamicValue(() => {
            return {
                query: function(sql: string, cb: (err: Error, rows: any[], fields: any[]) => void, items?: Array<any>) {
                    if (!items) cb(null, [], []);
                    else if (items[0] === "exist") {
                        cb(null, [{title: "exist", location_id: 100}], []);
                    } else if (items[0] === "error") {
                        cb(new Error("error"), [], []);
                    } else if (items[0] === 100) {
                        cb(null, [{title: "exist", location_id: 100}], []);
                    } else if (items[0] === 101) {
                        cb(null, [], []);
                    } else {
                        if(sql === 'INSERT INTO locations(title) values("new-item");'){
                            cb(null, [], []);
                        } else if(sql === 'INSERT INTO locations VALUES (100, "exist-item") ON DUPLICATE KEY UPDATE title = VALUES(title);'){
                            cb(null, [], []);
                        }
                        else cb(null, [], []);
                    }
                }
            };
        });
    });

    //正常系
    it('search', (done) => {
        Location.searchOrCreate("exist", (loc: Location)=>{
            expect(loc.id).to.deep.equal(100);
            done();
        });
    });

    it('create', (done) => {
        Location.searchOrCreate("not-exist", (loc: Location)=>{
            expect(loc.id).to.deep.equal(-1);
            done();
        });
    });

    it('create-error', (done) => {
        Location.searchOrCreate("error", (loc: Location)=>{
            chai.assert(!loc, 'DB接続でエラーが出ればLocationはnullなはず');
            done();
        });
    });

    it('load-exist', (done) => {
        Location.load(100, (loc: Location)=>{
            expect(loc.id).to.deep.equal(100);
            done();
        });
    });

    it('load-not-exist', (done) => {
        Location.load(101, (loc: Location)=>{
            chai.assert(!loc, 'load出来ない場合Locationはnullなはず');
            done();
        });
    });

    it('store', (done) => {
        const loc = new Location("new-item");
        loc.store((err: Error, rows: any[], fields: any[])=>{
            chai.assert(!err, 'errは起こらない');
            done();
        });
    });

    it('update', (done) => {
        const loc = new Location("exist-item", 100);
        loc.store((err: Error, rows: any[], fields: any[])=>{
            chai.assert(!err, 'errは起こらない');
            done();
        });
    });
});
