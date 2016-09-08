/// <reference path="../../../typings/index.d.ts"/>
import * as mysql from 'mysql';
import {MySqlInstance} from '../../infra/mysql';
import {kernel} from "../../bindings/inversify_initialize";
import {TYPES, MySqlIf} from "../../bindings/entities";
import * as _ from 'lodash';

export class Location{
    public id = -1;

    constructor(private title: string, id?: number){
        if(id) this.id = id;
    }

    public static load(locationId: number, cb: (loc: Location)=>void){
        const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
        mysql.query('SELECT * FROM `locations` WHERE `location_id` = ?', (error, rows, fields)=>{
            if(!error && rows.length > 0){
                cb(new Location(rows[0].title, rows[0].location_id));
            } else{
                cb(null);
            }
        }, [locationId]);
    }

    public static searchOrCreate(locationTitle: string, cb: (loc: Location)=>void){
        const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
        mysql.query('SELECT * FROM `locations` WHERE `title` = ?', (error, rows, fields)=>{
            if(error) {
                cb(null);
            } else if(rows.length > 0){
                cb(new Location(rows[0].title, rows[0].location_id));
            } else{
                cb(new Location(locationTitle));
            }
        }, [locationTitle]);
    }

    public store(cb: (err: Error, rows: any[], fields: any[]) => void){
        if(this.id === -1){
            this.createNewLocation((err: Error, rows: any[], fields: any[]) =>{
                Location.searchOrCreate(this.title, (loc: Location)=>{
                    this.id = loc.id;
                    cb(err, rows, [this.id]);
                });
            });
        } else{
            this.updateLocation((err: Error, rows: any[], fields: any[]) =>{
                cb(err, rows, [this.id]);
            });
        }
    }

    public static lookup(locationTitle: string, cb: (loc: Location[])=>void){
        const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
        mysql.query('SELECT * FROM `locations` WHERE `title` LIKE ?', (error, rows, fields)=>{
            if(rows.length > 0){
                const mapped: Location[] = _.map(rows, (row: any)=>{
                    return new Location(row.title, row.location_id);
                });
                cb(mapped);
            } else{
                cb([]);
            }
        }, [`%${locationTitle}%`]);
    }

    public delete(cb: (err: Error, rows: any[], fields: any[])=> void){
        if(this.id === -1) cb(new Error("not exist"), [], []);
        else{
            const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
            mysql.query('delete FROM `locations` WHERE `location_id` = ?', cb, [this.id]);
        }
    }

    private createNewLocation(cb: (err: Error, rows: any[], fields: any[]) => void){
        const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
        let sql = `INSERT INTO locations(title) values("${this.title}");`;
        mysql.query(sql, cb);
    }

    private updateLocation(cb: (err: Error, rows: any[], fields: any[]) => void){
        const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
        let sql = "INSERT INTO locations VALUES ";
        sql += `(${ this.id }, "${ this.title }") `;
        sql += "ON DUPLICATE KEY UPDATE title = VALUES(title);";
        mysql.query(sql, cb);
    }
}
