let connectMock;
const mongoClientMock = {
    connect: jest.fn(() => connectMock)
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const repository = require('../src/queryInformationRepository');

describe('queryInformationRepository', () => {
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

            const queriesTestProvider = [
                {
                    scenarioName: 'no parameters given',
                    expectedQuery: {}
                },
                {
                    scenarioName: 'queryPattern given',
                    queryPattern: 'lord of the rings',
                    expectedQuery: { title: new RegExp('.*lord of the rings.*', 'i') }
                },
                {
                    scenarioName: 'queryPattern given',
                    queryPattern: 'lord of the rings',
                    navigationId: 'NAVI_GATION',
                    expectedQuery: {
                        title: new RegExp('.*lord of the rings.*', 'i'),
                        navigationPath: 'NAVI_GATION'
                    }
                }
            ];

            queriesTestProvider.forEach(({ expectedQuery, navigationId, queryPattern, scenarioName}) => {
                describe(`find returns results (${scenarioName})`, () => {
                    let repositoryPromise;

                    beforeEach(() => {
                        connectMock = Promise.resolve(databaseObject);
                        repositoryPromise = repository(queryPattern, navigationId);
                    });

                    test('collection is called from database', () => {
                        expect(database.collection).toHaveBeenCalledWith('items');
                    });

                    test('find of collection is called', () => {
                        expect(collection.find).toHaveBeenCalledWith(expectedQuery);
                    });

                    test('database close has been called', () => {
                        expect(databaseObject.close).toHaveBeenCalled();
                    });

                    test('repository returns information-items from data source', (done) => {
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
