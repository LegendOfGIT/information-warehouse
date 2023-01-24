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
                    satelliteController: {
                        host: 'satellite-controller'
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
                    satelliteController: {
                        host: 'satellite-controller'
                    }
                }
            }
        }

        return configuration[environment];
    };