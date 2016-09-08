import "reflect-metadata";
import { decorate, injectable, inject, interfaces } from "inversify";
import {TYPES} from "./entities";
import {MySqlIf, LocationIf} from './entities';
import {Location} from '../domain/models/location';
import {MySqlInstance} from '../infra/mysql';
import * as ee from 'eventemitter2';
import {kernel} from "./inversify_initialize";

decorate(injectable(), ee.EventEmitter2);

kernel.bind<MySqlIf>(TYPES.MySqlIf).toDynamicValue(() => {
    return MySqlInstance.getInstance();
});

kernel.bind<interfaces.Factory<LocationIf>>("Factory<LocationIf>").toFactory<LocationIf>(() => {
    return (key: any, cb: (loc: Location)=>void) => {
        if (typeof key === "string") {
            Location.searchOrCreate('nkhr4', cb);
        } else if (typeof key === "number") {
            Location.load(key, cb);
        } else cb(null);

        return <LocationIf> null;
    };
});

export { kernel };
