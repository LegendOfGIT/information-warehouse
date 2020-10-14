let connectMock;
const mongoClientMock = {
    connect: jest.fn(() => connectMock)
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const repository = require('../../src/wishlist/getWishlistRepository');

describe('getWishlistRepository', () => {
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
            let findToArrayMock = Promise.resolve([
                { all: 'my' },
                { happy: 'items' }
            ]);
            const collection = {
                find: jest.fn(() => ({
                    items: [
                        'a', 'b', 'c'
                    ]
                }))
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

                    test('collection is called from database', () => {
                        expect(database.collection).toHaveBeenCalledWith('wishlist-items');
                    });

                    test('find of collection is called', () => {
                        expect(collection.find).toHaveBeenCalledWith(expectedQuery);
                    });

                    test('database close has been called', () => {
                        expect(databaseObject.close).toHaveBeenCalled();
                    });

                    test('repository returns wishlist-items from data source', (done) => {
                        repositoryPromise.then(response => {
                            expect(response).toEqual([
                                { all: 'my' },
                                { happy: 'items' }
                            ]);

                            done();
                        });
                    });
                });
            });

            describe('find rejects', () => {
                let repositoryPromise;

                beforeEach(() => {
                    findToArrayMock = Promise.reject('no results');
                    connectMock = Promise.resolve(databaseObject);
                    repositoryPromise = repository();
                });

                test('repository rejects with an error', (done) => {
                    repositoryPromise.then().catch(error => {
                        expect(error).toBe('no results');
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
