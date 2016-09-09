/// <reference path="../../typings/index.d.ts"/>

import * as _ from 'lodash';
import {ItemStateManager} from './states/item_states';

export class ItemFlow{
  private locationStateManager_ = new ItemStateManager();

  constructor(){
  }

  command(args: any[], cb: (message: string)=>void){
    console.log("command");
    if(args[0] !== "item"){
      console.log("command2");
      if(!isNaN(args[0])) {
        console.log("command3");
        this.number_(parseInt(args[0]), cb);
      } else {
        console.log("command4");
        this.otherCommand_(cb);
      }
    } else if(args[1] === "add"){
      this.add_(args[2], cb);
    } else if(args[1] === "search"){
      this.lookup_(args[2], cb);
    } else if(args[1] === "delete"){
      this.delete_(args[2], cb);
    }
  }

  private otherCommand_(cb: (message: string)=>void){

  }

  private add_(title: string, cb: (message: string)=>void){
    this.locationStateManager_.state.add(this.locationStateManager_, title, cb);
  }

  private lookup_(title: string, cb: (message: string)=>void){
    this.locationStateManager_.state.lookup(this.locationStateManager_, title, cb);
  }

  private delete_(title: string, cb: (message: string)=>void){
    this.locationStateManager_.state.delete(this.locationStateManager_, title, (message: string)=>{
      console.log(this.locationStateManager_.state);
      cb(message);
    });
  }

  private number_(id: number, cb: (message: string)=>void){
    this.locationStateManager_.state.number(this.locationStateManager_, id, cb);
  }
}
