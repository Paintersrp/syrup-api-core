// import { SyCreateMixin } from './SyCreateMixin';
// import { Optional, Transaction } from 'sequelize';
// import * as Router from 'koa-router';
// import * as sinon from 'sinon';
// import * as supertest from 'supertest';
// import * as HttpStatus from '../../../lib';

// describe('SyCreateMixin', () => {
//   let syCreateMixin: SyCreateMixin;
//   let routerContext: Router.RouterContext;
//   let transaction: Transaction;
//   let mockModel: any;

//   beforeEach(() => {
//     routerContext = {
//       // mock the necessary properties of ctx
//     } as Router.RouterContext;
//     transaction = {
//       // mock the necessary properties of transaction
//     } as Transaction;
//     mockModel = {
//       create: sinon.stub(),
//       bulkCreate: sinon.stub(),
//     };
//     syCreateMixin = new SyCreateMixin({
//       model: mockModel,
//       // other necessary options
//     });
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   // Test cases go here
// });

// describe('create', () => {
//   it('should create an instance of the model', async () => {
//     const payload = { prop1: 'value1', prop2: 'value2' };
//     routerContext.request.body = payload;
//     const responseItem = { id: 1, ...payload };
//     mockModel.create.resolves(responseItem);

//     await syCreateMixin.create(routerContext, transaction);

//     expect(mockModel.create.calledWith(payload, { transaction })).toBeTruthy();
//     expect(routerContext.body).toEqual({
//       statusCode: HttpStatus.CREATED,
//       data: responseItem,
//     });
//   });
// });

// describe('bulkCreate', () => {
//   it('should create multiple instances of the model', async () => {
//     const payload = [
//       { prop1: 'value1', prop2: 'value2' },
//       { prop1: 'value3', prop2: 'value4' },
//     ];
//     routerContext.request.body = payload;
//     const responseItems = [
//       { id: 1, ...payload[0] },
//       { id: 2, ...payload[1] },
//     ];
//     mockModel.bulkCreate.resolves(responseItems);

//     await syCreateMixin.bulkCreate(routerContext, transaction, []);

//     expect(mockModel.bulkCreate.calledWith(payload, { transaction, include: [] })).toBeTruthy();
//     expect(routerContext.body).toEqual({
//       statusCode: HttpStatus.CREATED,
//       data: responseItems,
//     });
//   });
// });

// describe('create with invalid inputs', () => {
//   it('should handle validation errors', async () => {
//     const payload = { prop1: 'invalid', prop2: 'value2' };
//     routerContext.request.body = payload;
//     const error = new Error('Validation error');
//     mockModel.create.rejects(error);

//     await syCreateMixin.create(routerContext, transaction);

//     expect(routerContext.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
//     expect(routerContext.body).toEqual({
//       statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//       message: error.message,
//     });
//   });
// });

// import { performance } from 'perf_hooks';

// describe('bulkCreate under high load', () => {
//   it('should handle a large number of instances', async () => {
//     const payload = new Array(1000).fill({ prop1: 'value', prop2: 'value' });
//     routerContext.request.body = payload;
//     const responseItems = payload.map((item, index) => ({ id: index + 1, ...item }));
//     mockModel.bulkCreate.resolves(responseItems);

//     const startTime = performance.now();
//     await syCreateMixin.bulkCreate(routerContext, transaction, []);
//     const endTime = performance.now();

//     expect(mockModel.bulkCreate.callCount).toBe(5); // since batchSize is 200 and payload is 1000
//     expect(endTime - startTime).toBeLessThan(2000); // just an example, adjust the threshold as needed
//   });
// });
