/// <reference path="../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {Location} from '../models/location';
import {Set} from '../models/set';
import {kernel, lazyInject} from "../../bindings/inversify_initialize"
import {Item} from '../models/item';

export class UseStateManager{
  public state: UseStateTemplate;

  constructor(){
    this.state = new InitialState();
  }

  setState(state: UseStateTemplate){
    this.state = state;
  }
}

class UseStateTemplate{
  constructor(){}

  use(manager: UseStateManager, name: string, title: string, cb: (message: string)=>void){
    Item.searchOrCreate(title, (item: Item)=> {
      if (item.id === -1) {
        cb("そんなものないよ");
      }
      else{
        cb("OK");
        item.user_name = name;
        manager.setState(new AskingTermState(item, cb));
      }
    });
  }

  otherCommand(manager: UseStateManager){
    manager.setState(new InitialState());
  }

  number(manager: UseStateManager, id: number, cb: (message: string)=>void){
    manager.setState(new InitialState());
  }
}

export class InitialState extends UseStateTemplate{

}

export class AskingTermState extends UseStateTemplate{
  constructor(private item_: Item, cb: (message: string)=>void){
    super();
    cb("どれくらいの期間使う？");
    cb("1: 1日");
    cb("2: 1週間");
    cb("3: 1ヶ月");
    cb("4: 1年");
    cb("1年以上のものは1年を選択して都度更新してね");
  }

  number(manager: UseStateManager, id: number, cb: (message: string)=>void){
    let term = 0;
    switch(id){
      case 1:
        term = 1;
        break;
      case 2:
        term = 7;
        break;
      case 3:
        term = 30;
        break;
      case 4:
        term = 365;
        break;
      default:
        term = -1;
    }

    if(term > 0) {
      this.item_.use(term, (err, rows, fields)=>{
        if(err) cb("あかんかった");
        else cb("期限内に返してね");
        console.log(err);
        manager.setState(new InitialState());
      });
    } else{
      cb("やりなおし");
    }
  }
}

