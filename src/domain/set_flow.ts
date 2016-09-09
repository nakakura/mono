/// <reference path="../../typings/index.d.ts"/>

import * as _ from 'lodash';
import {SetStateManager} from './states/set_states';

export class SetFlow{
  private setStateManager_ = new SetStateManager();

  constructor(){
  }

  command(user: string, args: any[], cb: (message: string)=>void){
    console.log("command");
    if(args[0] !== "set"){
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
    } else if(args[1] === "use"){
      console.log("item set use====");
      this.use_(user, args[2], cb);
    } else{
      this.otherCommand_(cb);
    }
  }

  private otherCommand_(cb: (message: string)=>void){
    this.setStateManager_.state.otherCommand(this.setStateManager_);
  }

  private add_(title: string, cb: (message: string)=>void){
    this.setStateManager_.state.add(this.setStateManager_, title, cb);
  }

  private lookup_(title: string, cb: (message: string)=>void){
    this.setStateManager_.state.lookup(this.setStateManager_, title, cb);
  }

  private delete_(title: string, cb: (message: string)=>void){
    this.setStateManager_.state.delete(this.setStateManager_, title, (message: string)=>{
      console.log(this.setStateManager_.state);
      cb(message);
    });
  }

  private use_(user: string, title: string, cb: (message: string)=>void){
    this.setStateManager_.state.use(this.setStateManager_, user, title, cb);
  }

  private number_(id: number, cb: (message: string)=>void){
    this.setStateManager_.state.number(this.setStateManager_, id, cb);
  }
}
