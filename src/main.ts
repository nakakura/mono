/// <reference path="../typings/index.d.ts"/>
import {Location} from './domain/models/location';
import {LocationFlow} from "./domain/location_flow";
import {kernel} from './bindings/inversify.config';
import * as _ from 'lodash';

export class Mono{
  constructor(){
    const k = kernel;
    const item = new Location("なかはら");
    item.store((err, rows, fields)=> {
      const flow = new LocationFlow();
      flow.lookup("なかはら", (items: Location[])=> {
        console.log(items);
        console.log("にほんごA;");
      });
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
