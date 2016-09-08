/// <reference path="../../../typings/index.d.ts"/>
import * as mysql from 'mysql';
import {MySqlInstance} from '../../infra/mysql';
import {kernel} from "../../bindings/inversify_initialize";
import {TYPES, MySqlIf} from "../../bindings/entities";

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
            this.createNewLocation(cb);
        } else{
            this.updateLocation(cb);
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
