/// <reference path="../../typings/index.d.ts"/>

import * as _ from 'lodash';
import {SetStateManager} from './states/set_states';

export class SetFlow{
  private stateHash_: {[key: string]: SetStateManager} = {};

  constructor(){
  }

  command(name: string, args: any[], cb: (message: string)=>void){
    if(!(name in this.stateHash_)) this.stateHash_[name] = new SetStateManager();
    if(args[0] !== "set"){
      if(!isNaN(args[0])) {
        this.number_(name, parseInt(args[0]), cb);
      } else {
        this.otherCommand_(name, cb);
      }
    } else if(args[1] === "add"){
      this.add_(name, args[2], cb);
    } else if(args[1] === "search"){
      this.lookup_(name, args[2], cb);
    } else if(args[1] === "delete"){
      this.delete_(name, args[2], cb);
    } else if(args[1] === "use"){
      this.use_(name, args[2], cb);
    } else{
      this.otherCommand_(name, cb);
    }
  }

  private otherCommand_(name: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.otherCommand(manager);
  }

  private add_(name: string, title: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.add(manager, title, cb);
  }

  private lookup_(name: string, title: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.lookup(manager, title, cb);
  }

  private delete_(name: string, title: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.delete(manager, title, (message: string)=>{
      cb(message);
    });
  }

  private use_(name: string, title: string, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.use(manager, name, title, cb);
  }

  private number_(name: string, id: number, cb: (message: string)=>void){
    const manager = this.stateHash_[name];
    manager.state.number(manager, id, cb);
  }
}
