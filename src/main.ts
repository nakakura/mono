/// <reference path="../typings/index.d.ts"/>
import {SetFlow} from "./domain/set_flow";
import {LocationFlow} from "./domain/location_flow";
import {ItemFlow} from "./domain/item_flow";
import {UseFlow} from "./domain/use_flow";
import {kernel} from './bindings/inversify.config';
import * as _ from 'lodash';

export class Mono{
  private locationFlow_ = new LocationFlow();
  private setFlow_ = new SetFlow();
  private itemFlow_ = new ItemFlow();
  private useFlow_ = new UseFlow();

  constructor(){
    const k = kernel;
  }

  exec(user: string, args: string[], msg: any){
    this.locationFlow_.command(user, args, (message: string)=>{
      msg.send(message);
    });

    this.setFlow_.command(user, args, (message: string)=>{
      msg.send(message);
    });

    this.itemFlow_.command(user, args, (message: string)=>{
      msg.send(message);
    });

    this.useFlow_.command(user, args, (message: string)=>{
      msg.send(message);
    });
  }
}



