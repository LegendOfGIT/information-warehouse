let connectMock;
const mongoClientMock = {
    connect: jest.fn(() => connectMock)
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const repository = require('../../src/wishlist/getWishlistItemsRepository');

describe('getWishlistItemsRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('connect throws an error', () => {
        beforeEach(() => {
            connectMock = Promise.reject('no connection!');
        });

        test('repository throws an error', (done) => {
            repository().then().catch(error => {
                expect(error).toEqual('no connection!');
                done();
            });
        });
    });

    describe('successfully connects', () => {
        beforeEach(() => {
            connectMock = Promise.resolve();
        });

        test('repository connects to mongodb', (done) => {
            repository().then(() => {
                expect(mongoClientMock.connect).toBeCalledWith(
                    'mongodb://localhost:27017/wishlists'
                );

                done();
            })
        });

        describe('connect callback called without error', () => {
            const collection = {
                findOne: jest.fn(() => (Promise.resolve({
                    items: [
                        'a', 'b', 'c'
                    ]
                })))
            };
            const database = {
                collection: jest.fn(() => collection)
            };
            const databaseObject = {
                close: jest.fn(),
                db: () => database
            };

            const queriesTestProvider = [
                {
                    scenarioName: 'no parameters given',
                    expectedQuery: {}
                },
                {
                    scenarioName: 'userId given',
                    userId: 'aaa-bbb-ccc',
                    expectedQuery: { userId: 'aaa-bbb-ccc' }
                }
            ];

            queriesTestProvider.forEach(({ expectedQuery,scenarioName, userId}) => {
                describe(`find returns results (${scenarioName})`, () => {
                    let repositoryPromise;

                    beforeEach(() => {
                        connectMock = Promise.resolve(databaseObject);
                        repositoryPromise = repository(userId);
                    });

                    test('collection is called from database', (done) => {
                        repositoryPromise.then(() => {
                            expect(database.collection).toHaveBeenCalledWith('wishlist-items');
                            done();
                        });
                    });

                    test('find of collection is called', (done) => {
                        repositoryPromise.then(() => {
                            expect(collection.findOne).toHaveBeenCalledWith(expectedQuery);
                            done();
                        });
                    });

                    test('database close has been called', (done) => {
                        repositoryPromise.then(() => {
                            expect(databaseObject.close).toHaveBeenCalled();
                            done();
                        });
                    });

                    test('repository returns wishlist-items from data source', (done) => {
                        repositoryPromise.then(response => {
                            expect(response).toEqual(['a', 'b', 'c']);

                            done();
                        });
                    });
                });
            });

            describe('find rejects', () => {
                let repositoryPromise;

                beforeEach(() => {
                    collection.findOne = jest.fn(() => Promise.reject('no results'));
                    connectMock = Promise.resolve(databaseObject);
                    repositoryPromise = repository();
                });

                test('repository resolved with an empty array', (done) => {
                    repositoryPromise.then((response) => {
                        expect(response).toEqual([]);
                        done();
                    });
                });

                test('database close has been called', () => {
                    repositoryPromise.then().catch(() => {
                        expect(databaseObject.close).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
