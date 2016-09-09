/// <reference path="../typings/index.d.ts"/>
import {SetFlow} from "./domain/set_flow";
import {LocationFlow} from "./domain/location_flow";
import {ItemFlow} from "./domain/item_flow";
import {kernel} from './bindings/inversify.config';
import * as _ from 'lodash';

export class Mono{
  private locationFlow_ = new LocationFlow();
  private setFlow_ = new SetFlow();
  private itemFlow_ = new ItemFlow();

  constructor(){
    const k = kernel;
  }

  exec(user: string, args: string[], msg: any){
    console.log(user);
    console.log(args);
    this.locationFlow_.command(args, (message: string)=>{
      msg.send(message);
    });

    this.setFlow_.command(args, (message: string)=>{
      msg.send(message);
    });

    this.itemFlow_.command(args, (message: string)=>{
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
