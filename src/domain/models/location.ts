/// <reference path="../../../typings/index.d.ts"/>
import * as mysql from 'mysql';
import {MySqlInstance} from '../../infra/mysql';

export class Location{
    constructor(public id: number, private title: string){
    }

    public static load(locationId: number, cb: (loc: Location)=>void){
        const mysql = MySqlInstance.getInstance();
        mysql.query('SELECT * FROM `locations` WHERE `location_id` = ?', (error, rows, fields)=>{
            if(!error && rows.length > 0){
                cb(new Location(rows[0].location_id, rows[0].title));
            } else{
                cb(null);
            }
        }, [locationId]);
    }

    public static search(locationTitle: string, cb: (loc: Location)=>void){
        const mysql = MySqlInstance.getInstance();
        mysql.query('SELECT * FROM `locations` WHERE `title` = ?', (error, rows, fields)=>{
            if(!error && rows.length > 0){
                cb(new Location(rows[0].location_id, rows[1].title));
            } else{
                cb(null);
            }
        }, [locationTitle]);
    }

    public store(cb: (err: Error, rows: any[], fields: any[]) => void){
        const mysql = MySqlInstance.getInstance();
        let sql = "INSERT INTO locations VALUES ";
        sql += `(${ this.id }, "${ this.title }") `;
        sql += "ON DUPLICATE KEY UPDATE title = VALUES(title);";
        console.log(sql);
        mysql.query(sql, cb);
    }
}
