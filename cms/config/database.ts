const path = require('path')

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite')

  if (client === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host:     env('DATABASE_HOST',     'localhost'),
          port:     env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME',     'aisaph_cv'),
          user:     env('DATABASE_USERNAME', 'postgres'),
          password: env('DATABASE_PASSWORD', ''),
          ssl:      env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
        },
        pool: { min: 2, max: 10 },
      },
    }
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  }
}