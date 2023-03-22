const params = process.env;

module.exports = {
  flywayArgs: {
      url: params.FLYWAY_URL || 'jdbc:postgresql://localhost:5432/random_user',
      schemas: ['random_user', 'audit'],
      locations: ['filesystem:./migrations'],
      user: params.FLYWAY_USERNAME || 'postgres',
      password: params.FLYWAY_PASSWORD || 'postgres',
      outOfOrder: true
  }
}
