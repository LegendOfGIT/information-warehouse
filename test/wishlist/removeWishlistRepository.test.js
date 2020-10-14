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

const repository = require('../../src/wishlist/removeWishlistRepository');

let consoleMock;

const originalConsole = global.console;

describe('removeWishlistRepository', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    beforeEach(() => {
        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;
    });

    describe('called without required arguments', () => {
        test('logs a message', (done) => {
            repository().then().catch((error) => {
                expect(error).toEqual('required userId is missing');
                expect(consoleMock.log).toBeCalledWith(error);
                expect(successfulConnectionCollectionRemoveOneMock).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('called with required arguments', () => {
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
                repositoryPromise = repository('aaaa-bbb-ccc');
            });

            test('repository connects to mongodb', (done) => {
                repositoryPromise.then(() => {
                    expect(mongoClientMock.connect).toBeCalledWith(
                        'mongodb://localhost:27017/wishlists'
                    );

                    done();
                });
            });

            test('collection is called from database', (done) => {
                repositoryPromise.then(() => {
                    expect(successfulConnectionCollectionMock).toHaveBeenCalledWith('wishlist-items');
                    done();
                });
            });

            describe('removeOne succeeds', () => {
                test('removeOne of collection is called', (done) => {
                    repositoryPromise.then(() => {
                        expect(successfulConnectionCollectionRemoveOneMock).toHaveBeenCalledWith({ userId: 'aaaa-bbb-ccc' });
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
