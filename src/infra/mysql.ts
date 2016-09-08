/// <reference path="../../typings/index.d.ts"/>
import * as mysql from 'mysql';
import * as _ from 'lodash';
import {MySqlIf} from "../bindings/entities";

export class MySqlInstance implements MySqlIf{
  private static _instance: MySqlInstance= null;

  constructor(private _connection: mysql.IConnection) {
    if(MySqlInstance._instance){
      throw new Error("must use the getInstance.");
    }
    MySqlInstance._instance = this;
  }

  public static getInstance(): MySqlInstance{
    if(MySqlInstance._instance === null) {
      const uri = MySqlInstance._getMySqlUri();
      const connection = mysql.createConnection(uri);
      connection.query('CREATE TABLE IF NOT EXISTS locations(location_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(128) unique NOT NULL);', (error, results, fields)=>{
          if(error) console.error(error);
      });
      MySqlInstance._instance = new MySqlInstance(connection);
    }

    return MySqlInstance._instance;
  }

  private static _getMySqlUri(){
    const env = process.env;
    if("VCAP_SERVICES" in env){
      const item = JSON.parse(env["VCAP_SERVICES"]);
      console.log(item);
      console.log(item['mysql-5.5'][0]['tags']);
      console.log(item['mysql-5.5'][0]['credentials']);
      if("mysql-5.5" in item){
        return item['mysql-5.5'][0]['credentials']['uri'] + "&charset=UTF8_GENERAL_CI";
      }
    }

    const local: any = {};
    local.uri = "";
    //d22819c60305b41128698f87c6fb26396
      console.log("mysql://mono:mono@10.211.55.3:3306/mono?charset=UTF8_GENERAL_CI");
    return "mysql://mono:mono@10.211.55.3:3306/mono?charset=UTF8_GENERAL_CI";
  }

  public query(sql: string, cb: (err: Error, rows: any[], fields: any[]) => void, items?: Array<any>){
      this._connection.query(sql, items, cb);
  }
}
