const MongoError = require('mongodb').MongoError;

let successfulConnectionCollectionInsertOneMock = jest.fn(() => Promise.resolve());
const successfulConnectionCollectionMock = jest.fn(() => ({
    insertOne: successfulConnectionCollectionInsertOneMock
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

const repository = require('../../src/wishlist/storeWishlistItemsRepository');

let consoleMock;

const originalConsole = global.console;

describe('storeWishlistItemsRepository', () => {
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
        test('without userId rejects with a message', (done) => {
            repository().then().catch((error) => {
                expect(error).toEqual('required userId is missing');
                expect(consoleMock.log).toBeCalledWith(error);
                expect(successfulConnectionCollectionInsertOneMock).not.toHaveBeenCalled();
                done();
            });
        });

        test('without items rejects with a message', (done) => {
            repository('abcdef').then().catch((error) => {
                expect(error).toEqual('required wishlistItems are missing');
                expect(consoleMock.log).toBeCalledWith(error);
                expect(successfulConnectionCollectionInsertOneMock).not.toHaveBeenCalled();
                done();
            });
        });
    });

    describe('called with required arguments', () => {
        describe('connect throws an error', () => {
            const error = new MongoError('no connection');

            beforeEach(() => {
                connectMock = Promise.reject(error);
            });

            test('repository throws an error', (done) => {
                repository('a', ['a']).then().catch((e) => {
                    expect(e).toBe(error);
                    done();
                });
            });
        });

        describe('successfully connects', () => {
            let repositoryPromise;

            beforeEach(() => {
                connectMock = Promise.resolve(successfulConnectionMock);
                repositoryPromise = repository(
                    'aaaaa-bbb-ccc',
                    [
                        'abc',
                        'def'
                    ]
                );
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

            describe('insertOne succeeds', () => {
                test('insertOne of collection is called', (done) => {
                    repositoryPromise.then(() => {
                        expect(successfulConnectionCollectionInsertOneMock).toHaveBeenCalledWith({
                            userId: 'aaaaa-bbb-ccc',
                            items: [
                                'abc',
                                'def'
                            ]
                        });
                        done();
                    });
                });
            });

            describe('insertOne fails', () => {
                beforeEach(() => {
                    successfulConnectionCollectionInsertOneMock = () => Promise.reject('insert failed');
                });

                test('repository rejects', (done) => {
                    repository('a', ['a']).then().catch((error) => {
                        expect(error).toBe('insert failed');
                        done();
                    });
                });
            });
        });
    });
});
