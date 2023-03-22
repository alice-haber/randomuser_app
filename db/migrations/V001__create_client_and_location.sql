CREATE TABLE client (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE location (
	location_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
	CONSTRAINT fk_client_id
		FOREIGN KEY(client_id) 
		REFERENCES client(client_id)
);