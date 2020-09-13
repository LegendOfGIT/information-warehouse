const MongoError = require('mongodb').MongoError;

let connectCallbackMethod;
const mongoClientMock = {
    connect: jest.fn((uri, options, connectCallback) => {
        connectCallbackMethod = connectCallback;
    })
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const storeInformationRepository = require('../src/storeInformationRepository');

let consoleMock;

const originalConsole = global.console;

describe('storeInformationRepository', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    beforeEach(() => {
        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;
    });

    describe('called without required properties in information object', () => {
        test('logs a message', () => {
            storeInformationRepository();

            expect(consoleMock.log).toBeCalledWith('required itemId is missing');
        });
    });

    describe('called with required properties in information object', () => {
        describe('connect throws an error', () => {
            test('repository throws an error', () => {
                storeInformationRepository({
                    itemId: 'abc'
                });

                const error = new MongoError('no connection');
                expect(() => {
                    connectCallbackMethod(error);
                }).toThrowError(error);
            });

        });

        describe('successfully connects', () => {
            test('repository connects to mongodb', () => {
                storeInformationRepository({
                    itemId: 'abc'
                });

                expect(mongoClientMock.connect).toBeCalledWith(
                    'mongodb://localhost:27017/information-items',
                    {},
                    connectCallbackMethod
                );
            });

            describe('connect callback called without error', () => {
                const collection = {
                    insertOne: jest.fn(() => Promise.resolve({}))
                };
                const database = {
                    collection: jest.fn(() => collection)
                };
                const databaseObject = {
                    close: jest.fn(),
                    db: () => database
                };

                beforeEach(() => {
                    connectCallbackMethod(null, databaseObject);
                });

                test('collection is called from database', () => {
                    expect(database.collection).toHaveBeenCalledWith('items');
                });

                test('insertOne of collection is called', () => {
                    expect(collection.insertOne).toHaveBeenCalledWith({ itemId: 'abc' });
                });
            });
        });
    });
});
