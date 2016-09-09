/// <reference path="../../../typings/index.d.ts"/>
import * as mysql from 'mysql';
import {MySqlInstance} from '../../infra/mysql';
import {kernel} from "../../bindings/inversify_initialize";
import {TYPES, MySqlIf} from "../../bindings/entities";
import * as _ from 'lodash';

export class Item{
  public id = -1;
  public user_name = "";
  public release_date = "";

  constructor(public title: string, id?: number, public loc_id?: number, public set_id?: number){
    if(id) this.id = id;
  }

  //fixme
  public static load(id: number, cb: (loc: Item)=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `items` WHERE `item_id` = ?', (error, rows, fields)=>{
      if(!error && rows.length > 0){
        //cb(new Item(rows[0].title, rows[0].item_id));
      } else{
        cb(null);
      }
    }, [id]);
  }

  public static searchOrCreate(itemTitle: string, cb: (loc: Item)=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `items` WHERE `title` = ?', (error, rows, fields)=>{
      if(error) {
        cb(null);
      } else if(rows.length > 0){
        cb(new Item(rows[0].title, rows[0].item_id, rows[0].location_id, rows[0].set_id));
      } else{
        cb(new Item(itemTitle));
      }
    }, [itemTitle]);
  }

  private createNewItem_(cb: (err: Error, rows: any[], fields: any[]) => void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    let sql = `INSERT INTO items(title, location_id, set_id) values("${this.title}", ${this.loc_id}, ${this.set_id});`;
    mysql.query(sql, cb);
  }

  public store(cb: (err: Error, rows: any[], fields: any[]) => void){
    if(this.id === -1){
      this.createNewItem_((err: Error, rows: any[], fields: any[]) =>{
        Item.searchOrCreate(this.title, (item: Item)=>{
          this.id = item.id;
          cb(err, rows, [this.id]);
        });
      });
    } else{
      this.updateitem((err: Error, rows: any[], fields: any[]) =>{
        cb(err, rows, [this.id]);
      });
    }
  }

  private updateitem(cb: (err: Error, rows: any[], fields: any[]) => void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    let sql = "INSERT INTO items VALUES ";
    sql += `(${ this.id }, "${ this.title }") `;
    sql += "ON DUPLICATE KEY UPDATE title = VALUES(title);";
    mysql.query(sql, cb);
  }

  public static lookup(itemTitle: string, cb: (loc: Item[])=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `items` WHERE `title` LIKE ?', (error, rows, fields)=>{
      if(rows.length > 0){
        const mapped: Item[] = _.map(rows, (row: any)=>{
          let location_id = -1;
          if('location_id' in row) location_id = row.location_id;
          let set_id = -1;
          if('set_id' in row) set_id = row.set_id;

          return new Item(row.title, row.item_id, location_id, set_id);
        });
        cb(mapped);
      } else{
        cb([]);
      }
    }, [`%${itemTitle}%`]);
  }

  public delete(cb: (err: Error, rows: any[], fields: any[])=> void){
    if(this.id === -1) cb(new Error("not exist"), [], []);
    else{
      const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
      mysql.query('delete FROM `items` WHERE `item_id` = ?', cb, [this.id]);
    }
  }

  public use(term: number, cb: (err: Error, rows: any[], fields: any[])=> void){
    let date = new Date();
    date.setDate(date.getDate() + term);
    if(date.getDay() === 0) date.setDate(date.getDate() + 1);
    else if(date.getDay() === 6) date.setDate(date.getDate() + 2);
    var dateFormat = require('dateformat');
    let dateString = dateFormat(date, "yyyy-mm-dd");

    let query = `UPDATE items SET user_name = "${this.user_name}", release_date = "${dateString}" WHERE id = ${this.id}`;
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('UPDATE items SET `user_name` = ?, `release_date` = ? WHERE `item_id` = ?', cb, [this.user_name, dateString, this.id]);
  }

  public static searchSetComponents(set_id: number, cb: (loc: Item[])=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `items` WHERE `set_id` = ?', (error, rows, fields)=>{
      if(rows.length > 0){
        const mapped: Item[] = _.map(rows, (row: any)=>{
          let location_id = -1;
          if('location_id' in row) location_id = row.location_id;
          let set_id = -1;
          if('set_id' in row) set_id = row.set_id;

          return new Item(row.title, row.item_id, location_id, set_id);
        });
        cb(mapped);
      } else{
        cb([]);
      }
    }, [set_id]);
  }

  public static searchUser(userName: string, cb: (loc: Item[])=>void){
    const mysql = kernel.get<MySqlIf>(TYPES.MySqlIf);
    mysql.query('SELECT * FROM `items` WHERE `user_name` = ?', (error, rows, fields)=>{
      if(rows.length > 0){
        const mapped: Item[] = _.map(rows, (row: any)=>{
          let location_id = -1;
          if('location_id' in row) location_id = row.location_id;
          let set_id = -1;
          if('set_id' in row) set_id = row.set_id;
          let release_date = "";
          if('release_date' in row)  release_date = row.release_date;
          const item = new Item(row.title, row.item_id, location_id, set_id);
          item.release_date = release_date;
          return item;
        });
        cb(mapped);
      } else{
        cb([]);
      }
    }, [userName]);
  }
}
