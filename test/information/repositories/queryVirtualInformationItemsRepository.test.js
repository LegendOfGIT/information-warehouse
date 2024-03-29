let connectMock;
const mongoClientMock = {
    connect: jest.fn(() => connectMock)
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const repository = require('../../../src/information/repositories/queryVirtualInformationItemsRepository');

describe('queryVirtualInformationItemsRepository', () => {
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
                    'mongodb://localhost:27017/information-items'
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
                    toArray: () => findToArrayMock
                }))
            };
            const database = {
                collection: jest.fn(() => collection)
            };
            const databaseObject = {
                close: jest.fn(),
                db: () => database
            };

            describe('find returns results', () => {
                let repositoryPromise;

                beforeEach(() => {
                    connectMock = Promise.resolve(databaseObject);
                    repositoryPromise = repository({
                        title: new RegExp('.*lord of the rings.*', 'i'),
                        navigationPath: 'NAVI_GATION'
                    });
                });

                test('collection is called from database', () => {
                    expect(database.collection).toHaveBeenCalledWith('virtual-items');
                });

                test('find of collection is called with expected arguments', () => {
                    expect(collection.find).toHaveBeenCalledWith({
                        title: new RegExp('.*lord of the rings.*', 'i'),
                        navigationPath: 'NAVI_GATION'
                    });
                });

                test('database close has been called', () => {
                    expect(databaseObject.close).toHaveBeenCalled();
                });

                test('repository returns virtual-items from data source', (done) => {
                    repositoryPromise.then(response => {
                        expect(response).toEqual([
                            { all: 'my' },
                            { happy: 'items' }
                        ]);

                        done();
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
