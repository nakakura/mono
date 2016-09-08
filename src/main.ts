/// <reference path="../typings/index.d.ts"/>
import * as express from 'express';
import {Location} from './domain/models/location';
var path = require('path');

const port = process.env.VCAP_APP_PORT || 3000;
const app = express();
app.set('port', port);

const server: any = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

app.use('/pages', express.static('pages'));

app.get('/', (req: any, res: any)=>{
  res.sendfile('www/index.html');
});

const item = new Location("nkhr9");

item.store((err, rows, fields)=>{
    console.error(err);

    Location.searchOrCreate('nkhr4', (loc: Location)=>{
        console.log(loc);
    });

    Location.load(101, (loc: Location)=>{
        console.log(loc);
    });
});
