/// <reference path="../../typings/index.d.ts"/>

import * as _ from 'lodash';
import {UseStateManager} from './states/use_states';

export class UseFlow{
  private stateHash_: {[key: string]: UseStateManager} = {};

  constructor(){
  }

  command(name: string, args: any[], cb: (message: string)=>void){
    if(!(name in this.stateHash_)) this.stateHash_[name] = new UseStateManager()
    if(args[0] !== "item"){
      if(!isNaN(args[0])) {
        this.number_(name, parseInt(args[0]), cb);
      } else {
        this.otherCommand_(name, cb);
      }
    } else if(args[1] === "use"){
      this.use_(name, args[2], cb);
    } else if(args[1] === "release"){
      this.release_(name, args[2], cb);
    } else{
      this.otherCommand_(name, cb);
    }
  }

  private otherCommand_(name: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.otherCommand(manager);
  }

  private use_(name: string, title: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.use(manager, name, title, cb);
  }

  private release_(name: string, id: number, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.number(manager, id, cb);
  }

  private number_(name: string, id: number, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.number(manager, id, cb);
  }
}
