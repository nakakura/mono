/// <reference path="../typings/index.d.ts"/>

import Add from '../src/add';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon: any;

describe('Janus General GeneralSagas', () => {
  beforeEach(() => {
  });

  //正常系
  it('janus create session - success', () => {
    var add = new Add();
    expect(2).to.deep.equal(add.add(1,1));
  });
});
