module.exports =
    () => {
        const environment = process.env.NODE_ENV || 'production';
        const configuration = {
            development: {
                database: {
                    host: 'localhost',
                    port: 27017
                }
            },
            production: {
                database: {
                    host: '172.23.0.3',
                    port: 27017
                }
            }
        }

        return configuration[environment];
    };