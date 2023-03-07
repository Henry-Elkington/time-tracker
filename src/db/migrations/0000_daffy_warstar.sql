CREATE TABLE time_entrys (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`discription` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES users(`id`)
);

CREATE TABLE users (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`password` text NOT NULL
);
