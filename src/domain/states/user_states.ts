/// <reference path="../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {kernel, lazyInject} from "../../bindings/inversify_initialize"
import {Item} from '../models/item';

export class UserStateManager{
  public state: UserStateTemplate;

  constructor(){
    this.state = new InitialState();
  }

  setState(state: UserStateTemplate){
    this.state = state;
  }
}

class UserStateTemplate{
  user(manager: UserStateManager, userName: string, cb: (message: string)=>void){
    Item.searchUser(userName, (items: Item[])=>{
      const mapped = _.reduce(items, (sum: string, item: Item)=>{
        return `${sum}\n${item.title}: ${item.release_date}まで`
      }, "これだけ借りてるよ\n");
    });
  }
}

class InitialState extends UserStateTemplate{
}

