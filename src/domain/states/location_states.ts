/// <reference path="../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {Location} from '../models/location';
import {kernel, lazyInject} from "../../bindings/inversify_initialize"

export class LocationStateManager{
  public state: LocationStateTemplate;

  constructor(){
    this.state = new InitialState();
  }

  setState(state: LocationStateTemplate){
    this.state = state;
  }
}

class LocationStateTemplate{
  @lazyInject("Factory<LocationIf>")
  private locationFactory_: (key: any, cb: (loc: Location)=>void)=>void;

  add(manager: LocationStateManager, title: string, cb: (message: string)=>void){
    this.locationFactory_(title, (loc: Location)=>{
      if(loc.id !== -1) cb("もうあった");
      else{
        loc.store((err, rows, fields)=>{
          if(err) cb("なんかうまくいかんかった");
          else cb("登録したで");
        });
      }
    });
  }

  lookup(manager: LocationStateManager, title: string, cb: (message: string)=>void){
    Location.lookup(title, (items: Location[])=>{
      if(items.length !== 0){
        const message = _.reduce(items, (sum: string, item: Location)=>{
          return `${sum}\n${item.title}`;
        }, "");
        cb(message);
      } else{
        cb("それっぽいのはなかった");
      }
    });
  }

  delete(manager: LocationStateManager, title: string, cb: (message: string)=>void){
    Location.lookup(title, (items: Location[])=>{
      if(items.length === 1 && items[0].title === title) {
        items[0].delete((err, rows, fields)=>{
          if(err) cb("消せんかった");
          else cb("おｋ消した");
        });
      } else if(items.length === 0){
        cb("それっぽいのはなかった");
      } else{
        const message = _.reduce(items, (sum: string, item: Location)=>{
          return `${sum}\n${item.id}: ${item.title}`;
        }, "どれを消すのや？番号で教えてや(mono 1とか)\n");
        manager.setState(new DeleteState(items));
        cb(message + "\n0: やっぱ消さない");
      }
    });
  }

  otherCommand(manager: LocationStateManager){
    manager.setState(new InitialState());
  }

  number(manager: LocationStateManager, id: number, cb: (message: string)=>void){
    manager.setState(new InitialState());
  }
}

export class InitialState extends LocationStateTemplate{

}

export class DeleteState extends LocationStateTemplate{
  constructor(private locations_: Location[]){
    super();
  }

  add(manager: LocationStateManager, title: string, cb: (message: string)=>void){
    manager.setState(new InitialState());
    super.add(manager, title, cb);
  }

  lookup(manager: LocationStateManager, title: string, cb: (message: string)=>void){
    manager.setState(new InitialState());
    super.lookup(manager, title, cb);
  }

  delete(manager: LocationStateManager, title: string, cb: (message: string)=>void){
    cb("さっきの件はなかったことに");
    manager.setState(new InitialState());
    super.delete(manager, title, cb);
  }

  number(manager: LocationStateManager, id: number, cb: (message: string)=>void){
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


