const params = process.env;

module.exports = {
  flywayArgs: {
      url: params.FLYWAY_URL || 'jdbc:postgresql://localhost:5432/entity_resolution',
      schemas: ['entity_resolution', 'audit'],
      locations: ['filesystem:./migrations'],
      user: params.FLYWAY_USERNAME || 'postgres',
      password: params.FLYWAY_PASSWORD || 'postgres',
      outOfOrder: true
  }
}
