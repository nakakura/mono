/// <reference path="../../typings/index.d.ts"/>

import {Location} from './models/location';
import {kernel, lazyInject} from "../bindings/inversify_initialize";
import {TYPES, LocationIf} from '../bindings/entities';

export class LocationFlow{
    @lazyInject("Factory<LocationIf>")
    private locationFactory_: (key: any, cb: (loc: Location)=>void)=>void;

    constructor(){
    }

    add(title: string){
        this.locationFactory_(title, (loc: Location)=>{
            loc.store((err, rows, fields)=>{
                if(err) console.log(err);
                console.log(fields);
            });
        });
    }

    lookup(title: string, cb: (items: Location[])=>void){
        Location.lookup(title, (items: Location[])=>{
            cb(items);
        });
    }

    delete(title: string){
        this.locationFactory_(title, (loc: Location)=>{
            loc.delete((err, rows, fields)=>{
                console.log(fields);
            });
        })
    }
}
