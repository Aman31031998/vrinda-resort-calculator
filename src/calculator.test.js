import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, initial } from './calculator.js';
const estimate = patch => calculate({ ...initial, ...patch });
test('empty selections total zero; each service can stand alone', () => {
  assert.equal(estimate({}).total, 0);
  for (const [patch, expected] of [[{basic:true},70000],[{hall:'marriage'},22000],[{waiters:'300'},33250],[{decoration:'night'},30000],[{catering:'outside'},30000],[{generator:true,generatorHours:'2'},6000]]) assert.equal(estimate(patch).total,expected);
});
test('hall included hours and additional rates', () => {
  assert.equal(estimate({hall:'marriage',extraHours:'2'}).total,29000);
  assert.equal(estimate({hall:'other',extraHours:'1.5'}).total,20250);
  assert.equal(estimate({hall:'birthday',extraHours:'2'}).total,10000);
  assert.equal(estimate({extraHours:'5'}).total,0);
});
test('waiter gathering uses Charges column', () => {
  for (const [guests,price] of [[300,33250],[350,38000],[400,42750],[450,52250],[500,57000]]) assert.equal(estimate({waiters:String(guests)}).total,price);
});
test('DJ generator rules avoid double charging and charge outside fee', () => {
  assert.equal(estimate({dj:'without',generator:true,generatorHours:'4'}).total,13000);
  assert.equal(estimate({dj:'with',generator:true,generatorHours:'2'}).total,23000);
  assert.equal(estimate({dj:'with'}).total,17000);
  assert.equal(estimate({dj:'outside',generatorHours:'2'}).total,17000);
});
test('updated veg package and all catering packages', () => {
  for (const [kind,totals] of [['veg',[330000,350000,380000,405000,425000]],['nonveg',[360000,402500,440000,472500,500000]]]) [300,350,400,450,500].forEach((guests,index)=>assert.equal(estimate({catering:kind,cateringGuests:String(guests)}).total,totals[index]));
});
test('combined example and custom total including zero', () => {
  const state = {basic:true,hall:'marriage',extraHours:'2',waiters:'300',decoration:'day',dj:'outside',generatorHours:'2',catering:'veg',cateringGuests:'300'};
  assert.equal(estimate(state).subtotal,499250);
  assert.equal(estimate({...state,override:'480000'}).total,480000);
  assert.equal(estimate({...state,override:'0'}).total,0);
  assert.equal(estimate({...state,override:''}).total,499250);
});
test('invalid or negative amounts never produce negative/NaN totals', () => {
  assert.equal(estimate({hall:'marriage',extraHours:'-2',override:'-5'}).total,22000);
  assert.equal(estimate({generator:true,generatorHours:'garbage',override:'garbage'}).total,0);
});
