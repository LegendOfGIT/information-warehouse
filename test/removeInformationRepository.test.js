const MongoError = require('mongodb').MongoError;

let successfulConnectionCollectionRemoveOneMock = jest.fn(() => Promise.resolve());
const successfulConnectionCollectionMock = jest.fn(() => ({
    removeOne: successfulConnectionCollectionRemoveOneMock
}));
const successfulConnectionMock = {
    close: jest.fn(),
    db: jest.fn(() => ({
        collection: successfulConnectionCollectionMock
    }))
};
let connectMock = Promise.resolve(successfulConnectionMock);
const mongoClientMock = {
    connect: jest.fn(() => connectMock)
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const repository = require('../src/removeInformationRepository');

let consoleMock;

const originalConsole = global.console;

describe('removeInformationRepository', () => {
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
        test('logs a message', (done) => {
            repository().then(() => {
                expect(consoleMock.log).toBeCalledWith('required itemId is missing');
                done();
            });
        });
    });

    describe('called with required properties in information object', () => {
        describe('connect throws an error', () => {
            const error = new MongoError('no connection');
            let repositoryPromise;

            beforeEach(() => {
                connectMock = Promise.reject(error);
                repositoryPromise = repository({
                    itemId: 'abc'
                });
            });

            test('repository throws an error', (done) => {
                repositoryPromise.then().catch((e) => {
                    expect(e).toBe(error);
                    done();
                });
            });
        });

        describe('successfully connects', () => {
            let repositoryPromise;

            beforeEach(() => {
                connectMock = Promise.resolve(successfulConnectionMock);
                repositoryPromise = repository({
                    itemId: 'abc'
                });
            });

            test('repository connects to mongodb', (done) => {
                repositoryPromise.then(() => {
                    expect(mongoClientMock.connect).toBeCalledWith(
                        'mongodb://localhost:27017/information-items'
                    );

                    done();
                });
            });

            test('collection is called from database', (done) => {
                repositoryPromise.then(() => {
                    expect(successfulConnectionCollectionMock).toHaveBeenCalledWith('items');
                    done();
                });
            });

            describe('removeOne succeeds', () => {
                test('removeOne of collection is called', (done) => {
                    repositoryPromise.then(() => {
                        expect(successfulConnectionCollectionRemoveOneMock).toHaveBeenCalledWith({ itemId: 'abc' });
                        done();
                    });
                });
            });

            describe('removeOne fails', () => {
                beforeEach(() => {
                    successfulConnectionCollectionRemoveOneMock = () => Promise.reject('remove failed');
                    repositoryPromise = repository({
                        itemId: 'abc'
                    });
                });

                test('repository rejects', (done) => {
                    repositoryPromise.then().catch((error) => {
                        expect(error).toBe('remove failed');
                        done();
                    });
                });
            });
        });
    });
});
