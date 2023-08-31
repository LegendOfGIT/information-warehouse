module.exports =
    () => {
        const environment = process.env.NODE_ENV || 'production';
        const configuration = {
            development: {
                application: {
                    host: '127.0.0.1'
                },
                database: {
                    host: 'localhost',
                    port: 27017
                },
                services: {
                    satellite: {
                        host: 'localhost',
                        port: 3000
                    },
                    satelliteController: {
                        host: 'localhost',
                        port: 3001
                    }
                }
            },
            production: {
                application: {
                    host: '0.0.0.0'
                },
                database: {
                    host: 'warehouse-database',
                    port: 27017
                },
                services: {
                    satellite: {
                        host: 'satellite',
                        port: 3000
                    },
                    satelliteController: {
                        host: 'satellite-controller',
                        port: 3001
                    }
                }
            }
        }

        return configuration[environment];
    };
