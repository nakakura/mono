/// <reference path="../../../typings/index.d.ts"/>
import * as mysql from 'mysql';
import {MySqlInstance} from '../../infra/mysql';
import {kernel} from "../../bindings/inversify_initialize";
import {TYPES, MySqlIf} from "../../bindings/entities";
import * as _ from 'lodash';

export class Set{
  public id = -1;

  constructor(public title: string, id?: number){
    if(id) this.id = id;
  }

  public static load(set_id: number, cb: (loc: Set)=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `sets` WHERE `set_id` = ?', (error, rows, fields)=>{
      if(!error && rows.length > 0){
        cb(new Set(rows[0].title, rows[0].set_id));
      } else{
        cb(null);
      }
    }, [set_id]);
  }

  public static searchOrCreate(setTitle: string, cb: (set: Set)=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `sets` WHERE `title` = ?', (error, rows, fields)=>{
      if(error) {
        cb(null);
      } else if(rows.length > 0){
        cb(new Set(rows[0].title, rows[0].set_id));
      } else{
        cb(new Set(setTitle));
      }
    }, [setTitle]);
  }

  public store(cb: (err: Error, rows: any[], fields: any[]) => void){
    if(this.id === -1){
      this.createNewset((err: Error, rows: any[], fields: any[]) =>{
        Set.searchOrCreate(this.title, (loc: Set)=>{
          this.id = loc.id;
          cb(err, rows, [this.id]);
        });
      });
    } else{
      this.updateset((err: Error, rows: any[], fields: any[]) =>{
        cb(err, rows, [this.id]);
      });
    }
  }

  public static lookup(setTitle: string, cb: (loc: Set[])=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `sets` WHERE `title` LIKE ?', (error, rows, fields)=>{
      if(rows.length > 0){
        const mapped: Set[] = _.map(rows, (row: any)=>{
          return new Set(row.title, row.set_id);
        });
        cb(mapped);
      } else{
        cb([]);
      }
    }, [`%${setTitle}%`]);
  }

  public static all(cb: (loc: Set[])=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `sets`', (error, rows, fields)=> {
      if (rows.length > 0) {
        const mapped: Set[] = _.map(rows, (row: any)=> {
          return new Set(row.title, row.set_id);
        });
        cb(mapped);
      } else {
        cb([]);
      }
    });
  }

  public delete(cb: (err: Error, rows: any[], fields: any[])=> void){
    if(this.id === -1) cb(new Error("not exist"), [], []);
    else{
      const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
      mysql.query('delete FROM `sets` WHERE `set_id` = ?', cb, [this.id]);
    }
  }

  private createNewset(cb: (err: Error, rows: any[], fields: any[]) => void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    let sql = `INSERT INTO sets(title) values("${this.title}");`;
    mysql.query(sql, cb);
  }

  private updateset(cb: (err: Error, rows: any[], fields: any[]) => void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    let sql = "INSERT INTO sets VALUES ";
    sql += `(${ this.id }, "${ this.title }") `;
    sql += "ON DUPLICATE KEY UPDATE title = VALUES(title);";
    mysql.query(sql, cb);
  }
}
