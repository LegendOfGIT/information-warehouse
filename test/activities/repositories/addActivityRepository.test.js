let connectMock;
const mongoClientMock = {
    connect: jest.fn(() => connectMock)
};
jest.doMock('mongodb', () => ({
    MongoClient: mongoClientMock
}));

const repository = require('../../../src/activities/repositories/addActivityRepository');

describe('addActivityRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('connect throws an error', () => {
        beforeEach(() => {
            connectMock = Promise.reject('no connection!');
        });

        test('repository throws an error', (done) => {
            repository({
                trackingArguments: {
                    arg: 'uments'
                },
                repository: () => {},
                repositoryArguments: {
                    repo: 'arguments'
                }
            }).then().catch(error => {
                expect(error).toEqual('no connection!');
                done();
            });
        });
    });

    describe('successfully connects', () => {
        beforeEach(() => {
            connectMock = Promise.resolve({
                db: () => ({
                    collection: () => ({
                        insertOne: () => Promise.resolve()
                    })
                }),
                close: jest.fn()
            });
        });

        test('repository connects to mongodb', (done) => {
            repository({
                repository: jest.fn()
            }).then(() => {
                expect(mongoClientMock.connect).toBeCalledWith(
                    'mongodb://localhost:27017/activities'
                );

                done();
            })
        });

        describe('connect callback called without error', () => {
            let insertOneResultMock = Promise.resolve({
                the: {
                    answer: [
                        'to', 'all', 'my', 'questions'
                    ]
                }
            });
            const collection = {
                insertOne: jest.fn(() => insertOneResultMock)
            };
            const database = {
                collection: jest.fn(() => collection)
            };
            const databaseObject = {
                close: jest.fn(),
                db: () => database
            };

            describe('insertOne resolves', () => {
                let repositoryPromise;
                const repositoryFunction = jest.fn();

                beforeEach(() => {
                    connectMock = Promise.resolve(databaseObject);
                    repositoryPromise = repository({
                        trackingArguments: {
                            arg: 'uments'
                        },
                        repository: repositoryFunction,
                        repositoryArguments: {
                            repo: 'arguments'
                        }
                    });
                });

                test('collection is called from database', () => {
                    expect(database.collection).toHaveBeenCalledWith('activities');
                });

                test('find of collection is called with expected arguments', () => {
                    expect(collection.insertOne).toHaveBeenCalledWith({
                        arg: 'uments'
                    });
                });

                test('database close has been called', () => {
                    expect(databaseObject.close).toHaveBeenCalled();
                });

                test('insert of activity was successful', (done) => {
                    repositoryPromise.then(response => {
                        expect(repositoryFunction).toHaveBeenCalledWith({
                            repo: 'arguments'
                        });

                        done();
                    });
                });
            });

            describe('find rejects', () => {
                let repositoryPromise;

                beforeEach(() => {
                    insertOneResultMock = Promise.reject('can not insert activity');
                    connectMock = Promise.resolve(databaseObject);
                    repositoryPromise = repository({
                        trackingArguments: {
                            arg: 'uments'
                        },
                        repository: () => {},
                        repositoryArguments: {
                            repo: 'arguments'
                        }
                    });
                });

                test('repository rejects with an error', (done) => {
                    repositoryPromise.then().catch(error => {
                        expect(error).toBe('can not insert activity');
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
