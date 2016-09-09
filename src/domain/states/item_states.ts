/// <reference path="../../../typings/index.d.ts"/>
import * as _ from 'lodash';
import {Location} from '../models/location';
import {Set} from '../models/set';
import {kernel, lazyInject} from "../../bindings/inversify_initialize"
import {Item} from '../models/item';

export class ItemStateManager{
  public state: ItemStateTemplate;

  constructor(){
    this.state = new InitialState();
  }

  setState(state: ItemStateTemplate){
    this.state = state;
  }
}

class ItemStateTemplate{
  constructor(){}

  add(manager: ItemStateManager, title: string, cb: (message: string)=>void){
    Item.searchOrCreate(title, (item: Item)=> {
      if (item.id !== -1) {
        manager.setState(new DoAddItemState(title, cb));
      }
      else{
        cb("OK");
        manager.setState(new AskingLocationState(title, cb));
      }
    });
  }

  lookup(manager: ItemStateManager, title: string, cb: (message: string)=>void){
    Item.lookup(title, (items: Item[])=>{
      if(items.length !== 0){
        const message = _.reduce(items, (sum: string, item: Item)=>{
          return `${sum}\n${item.title}`;
        }, "");
        cb(message);
      } else{
        cb("それっぽいのはなかった");
      }
    });
  }

  delete(manager: ItemStateManager, title: string, cb: (message: string)=>void){
    Item.lookup(title, (items: Item[])=>{
      if(items.length === 1 && items[0].title === title) {
        items[0].delete((err, rows, fields)=>{
          if(err) cb("消せんかった");
          else cb("おｋ消した");
        });
      } else if(items.length === 0){
        cb("それっぽいのはなかった");
      } else{
        const message = _.reduce(items, (sum: string, item: Item)=>{
          return `${sum}\n${item.id}: ${item.title}`;
        }, "どれを消すのや？番号で教えてや(mono 1とか)\n");
        manager.setState(new DeleteState(items));
        cb(message + "\n0: やっぱ消さない");
      }
    });
  }

  otherCommand(manager: ItemStateManager){
    manager.setState(new InitialState());
  }

  number(manager: ItemStateManager, id: number, cb: (message: string)=>void){
    manager.setState(new InitialState());
  }
}

export class DeleteState extends ItemStateTemplate{
  constructor(private items_: Item[]){
    super();
  }

  delete(manager: ItemStateManager, title: string, cb: (message: string)=>void){
    cb("さっきの件はなかったことに");
    manager.setState(new InitialState());
    super.delete(manager, title, cb);
  }

  number(manager: ItemStateManager, id: number, cb: (message: string)=>void){
    if(id === 0){
      cb("やめとくね");
      manager.setState(new InitialState());
      return;
    }
    const item = _.find(this.items_, (item)=>{
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

class DoAddItemState extends ItemStateTemplate{
  constructor(private title_: string, cb: (message: string)=>void){
    super();
    cb("もうあったけどもういっこ買ったの？");
    cb("0: 買ってない");
    cb("1: 買った");
  }

  otherCommand(manager: ItemStateManager){
    manager.setState(new InitialState());
  }

  number(manager: ItemStateManager, id: number, cb: (message: string)=>void){
    if(id === 0) {
      cb("Ok.聞かんかったことにするわ");
      manager.setState(new InitialState());
    } else{
      cb("Ok.もういっこ買ったのか");
      manager.setState(new AskingLocationState(this.title_, cb));
    }
  }
}

class AskingLocationState extends ItemStateTemplate{
  private locations_: Location[];

  constructor(private title_: string, cb: (message: string)=>void) {
    super();
    Location.all((locations: Location[])=> {
      this.locations_ = locations;
      if (locations.length > 0) {
        cb("置き場所が登録されてないなぁ");
      }
      const message = _.reduce(locations, (sum: string, loc: Location)=> {
        return `${sum}\n${loc.id}: ${loc.title}`;
      }, "どこにおいとくんや");
      cb(message);
    });
  }

  otherCommand(manager: ItemStateManager){
    manager.setState(new InitialState());
  }

  number(manager: ItemStateManager, id: number, cb: (message: string)=>void){
    if(id < 0) {
      cb("決めてないのね");
      manager.setState(new AskingSetState(this.title_, id, cb));
    } else{
      const loc = _.find(this.locations_, (item)=>{
        return item.id === id;
      });
      if(!loc){
        cb("そんな場所知らんぞ。確認して");
        const message = _.reduce(this.locations_, (sum: string, loc: Location)=>{
          return `${sum}\n${loc.id}: ${loc.title}`;
        }, "どこにおいとくんや");
        cb(message);
      } else{
        cb(`Ok.${loc.title}ね`);
        manager.setState(new AskingSetState(this.title_, id, cb));
      }
    }
  }
}

class AskingSetState extends ItemStateTemplate {
  private sets_: Set[];

  constructor(private title_: string, private loc_id_: number, cb: (message: string)=>void) {
    super();
    cb("これはなんかのセットとして登録するんか？");
    Set.all((sets: Set[])=> {
      this.sets_ = sets;
      if (sets.length === 0) {
        cb("と思ったけどセット登録がなんもないな。");
      }
      const message = _.reduce(sets, (sum: string, set: Set)=> {
        return `${sum}\n${set.id}: ${set.title}`;
      }, "どのセット？\n0: セットじゃない");
      cb(message);
    });
  }

  number(manager: ItemStateManager, id: number, cb: (message: string)=>void) {
    if (id < 0) {
      cb("決めてないのね");
      this.saveItem_(this.title_, this.loc_id_, id, cb);
    } else {
      const loc = _.find(this.sets_, (item)=> {
        return item.id === id;
      });
      if (!loc) {
        cb("そんなセット聞いてないな。確認して");
        const message = _.reduce(this.sets_, (sum: string, set: Set)=> {
          return `${sum}\n${set.id}: ${set.title}`;
        }, "どこにおいとくんや");
        cb(message);
      } else {
        cb(`Ok.${loc.title}と`);
        this.saveItem_(this.title_, this.loc_id_, id, cb);
      }
    }
  }

  private saveItem_(title: string, locId: number, setId: number, cb: (message: string)=>void) {
    const item = new Item(title, -1, locId, setId);
    item.store((err, row, fields)=>{
      if(err) cb("とうろくしっぱい！");
      else cb("Ok.記録");
    });
  }
}

export class InitialState extends ItemStateTemplate{

}

