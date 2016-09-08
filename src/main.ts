/// <reference path="../typings/index.d.ts"/>
import {Location} from './domain/models/location';
import {LocationFlow} from "./domain/location_flow";
import {kernel} from './bindings/inversify.config';
import * as _ from 'lodash';

const flow = new LocationFlow();
export class Mono{
  constructor(){
    const k = kernel;
  }

  exec(user: string, args: string[], msg: any){
    console.log(user);
    console.log(args);
    flow.command(args, (message: string)=>{
      msg.send(message);
    });
  }
}

/*

 */

/*

 item.store((err, rows, fields)=>{
 console.error(err);

 Location.searchOrCreate('nkhr4', (loc: Location)=>{
 console.log(loc);
 });

 Location.load(101, (loc: Location)=>{
 console.log(loc);
 });
 });
 */





/*

item.store((err, rows, fields)=>{
    console.error(err);

    Location.searchOrCreate('nkhr4', (loc: Location)=>{
        console.log(loc);
    });

    Location.load(101, (loc: Location)=>{
        console.log(loc);
    });
});
*/
