/// <reference path="../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {Set} from '../models/set';
import {kernel, lazyInject} from "../../bindings/inversify_initialize"
import {Item} from '../models/item';

export class SetStateManager{
  public state: SetStateTemplate;

  constructor(){
    this.state = new InitialState();
  }

  setState(state: SetStateTemplate){
    console.log("setstate");
    console.log(state);
    this.state = state;
  }
}

class SetStateTemplate{
  @lazyInject("Factory<LocationIf>")
  private locationFactory_: (key: any, cb: (loc: Location)=>void)=>void;

  add(manager: SetStateManager, title: string, cb: (message: string)=>void){
    console.log(title);
    Set.searchOrCreate(title, (set: Set)=>{
      if(set.id !== -1) cb("もうあった");
      else{
        set.store((err, rows, fields)=>{
          if(err) cb("なんかうまくいかんかった");
          else cb("登録したで");
        });
      }
    });
  }

  use(manager: SetStateManager, name: string, title: string, cb: (message: string)=>void){
    Set.searchOrCreate(title, (set: Set)=> {
      if (set.id === -1) {
        cb("そんなものないよ");
      }
      else{
        console.log("create asking term state");
        console.log(set);
        manager.setState(new AskingTermState(set, name, cb));
      }
    });
  }

  lookup(manager: SetStateManager, title: string, cb: (message: string)=>void){
    Set.lookup(title, (items: Set[])=>{
      if(items.length !== 0){
        const message = _.reduce(items, (sum: string, item: Set)=>{
          return `${sum}\n${item.title}`;
        }, "");
        cb(message);
      } else{
        cb("それっぽいのはなかった");
      }
    });
  }

  delete(manager: SetStateManager, title: string, cb: (message: string)=>void){
    Set.lookup(title, (items: Set[])=>{
      if(items.length === 1 && items[0].title === title) {
        items[0].delete((err, rows, fields)=>{
          if(err) cb("消せんかった");
          else cb("おｋ消した");
        });
      } else if(items.length === 0){
        cb("それっぽいのはなかった");
      } else{
        const message = _.reduce(items, (sum: string, item: Set)=>{
          return `${sum}\n${item.id}: ${item.title}`;
        }, "どれを消すのや？番号で教えてや(mono 1とか)\n");
        manager.setState(new DeleteState(items));
        cb(message + "\n0: やっぱ消さない");
      }
    });
  }

  otherCommand(manager: SetStateManager){
    manager.setState(new InitialState());
  }

  number(manager: SetStateManager, id: number, cb: (message: string)=>void){
    console.log("initial state");
    console.log(id);
    manager.setState(new InitialState());
  }
}

export class AskingTermState extends SetStateTemplate{
  constructor(private set_: Set, private name_: string, cb: (message: string)=>void){
    super();
    cb("どれくらいの期間使う？");
    cb("1: 1日");
    cb("2: 1週間");
    cb("3: 1ヶ月");
    cb("4: 1年");
    cb("1年以上のものは1年を選択して都度更新してね");
  }

  number(manager: SetStateManager, id: number, cb: (message: string)=>void) {
    console.log("number in set_states");
    let term = 0;
    switch (id) {
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

    if (term > 0) {
      console.log(this.set_);
      Item.searchSetComponents(this.set_.id, (items: Item[])=> {
        console.log("term===");
        console.log(items);
        _.each(items, (item: Item)=> {
          console.log(item);
          item.user_name = this.name_;
          item.use(term, (err, rows, fields)=> {
            if (err) cb("あかんかった");
            else cb(`${item.title}貸し出し`);
          });
        }).values();
      });
      cb("期限内に返してね");
    }
    manager.setState(new InitialState());
  }
}


export class InitialState extends SetStateTemplate{
}

export class DeleteState extends SetStateTemplate{
  constructor(private locations_: Set[]){
    super();
  }

  add(manager: SetStateManager, title: string, cb: (message: string)=>void){
    manager.setState(new InitialState());
    super.add(manager, title, cb);
  }

  lookup(manager: SetStateManager, title: string, cb: (message: string)=>void){
    manager.setState(new InitialState());
    super.lookup(manager, title, cb);
  }

  delete(manager: SetStateManager, title: string, cb: (message: string)=>void){
    cb("さっきの件はなかったことに");
    manager.setState(new InitialState());
    super.delete(manager, title, cb);
  }

  number(manager: SetStateManager, id: number, cb: (message: string)=>void){
    console.log("delete state");
    console.log(id);
    if(id === 0){
      cb("やめとくね");
      manager.setState(new InitialState());
      return;
    }
    const item = _.find(this.locations_, (item)=>{
      return item.id === id;
    });
    if(item) {
      item.delete((err, rows, fields)=> {
        if (err) cb("消せんかった");
        else cb("おｋ消した");
        manager.setState(new InitialState());
      });
    } else{
      cb("そんな選択肢出してないぞ");
    }
  }
}


