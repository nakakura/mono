/// <reference path="../../typings/index.d.ts"/>

import * as _ from 'lodash';
import {UseStateManager} from './states/use_states';

export class UseFlow{
  private useStateManager_ = new UseStateManager();

  constructor(){
  }

  command(name: string, args: any[], cb: (message: string)=>void){
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
    } else if(args[1] === "use"){
      this.use_(name, args[2], cb);
    } else if(args[1] === "release"){
      this.release_(args[2], cb);
    } else{
      this.otherCommand_(cb);
    }
  }

  private otherCommand_(cb: (message: string)=>void){
    this.useStateManager_.state.otherCommand(this.useStateManager_);
  }

  private use_(name: string, title: string, cb: (message: string)=>void){
    console.log("=====start using");
    this.useStateManager_.state.use(this.useStateManager_, name, title, cb);
  }

  private release_(id: number, cb: (message: string)=>void){
    this.useStateManager_.state.number(this.useStateManager_, id, cb);
  }

  private number_(id: number, cb: (message: string)=>void){
    this.useStateManager_.state.number(this.useStateManager_, id, cb);
  }
}
