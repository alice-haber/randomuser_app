TODOS
=====

1. Add observability to migrations
2. Add migration marker to dashboards

DB Naming Conventions
==============

# Use lowercase and underscores for db object names. Good examples: `client`, `onet_codes`; Bad examples: `ONETcodes`, `Clients`, `pre-sales`.
# Use singular for table and view names. Good Example: `client`; Bad example: `clients`.
# For tables with an id column, prefix `id` with `table_name_`. Good Example: `client.client_id`; Bad Examples: `client.id`, `client.uuid`, `client.client_uuid`
# Prefix foreign key constraints with `fk_` and the name of the target object. If there are two fks to the same table/column, append `_discrimiator` to the end. Good examples: `fk_client_id`, `fk_location_id_src`; Bad examples: `client_id_fk`, `fk_src_location_id`

Getting started
===============
Run `corepack yarn start` to startup a local db in a docker container. Note that this command is not daemonized.

Creating a migration
====================

First, reserve the migration # by going to #migrations in slack and reserving your migration number. Ex:

```
V5 in entity-resolution to make the badgers less hungry
```

Create a new `.sql` file in `./migrations` that is 5 digits long, zero padded and prepended with a v. Good example `v00001`; Bad examples: `v1`, `00001`, `v0001`.

Do not use schemas in these migration files; that is specified in the flyway configuration.

TODO: anything else?

Applying a migration
====================

TODO

Rolling back a migration
========================

TODO
