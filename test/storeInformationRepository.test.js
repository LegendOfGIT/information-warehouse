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
});
