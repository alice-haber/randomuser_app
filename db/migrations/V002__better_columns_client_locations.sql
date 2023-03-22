DROP TABLE location;
DROP TABLE client;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE client (
    client_id UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    lookup_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL
);

CREATE TABLE location (
	location_id UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    client_id UUID NOT NULL,
	CONSTRAINT fk_client_id
		FOREIGN KEY(client_id) 
		REFERENCES client(client_id)
);