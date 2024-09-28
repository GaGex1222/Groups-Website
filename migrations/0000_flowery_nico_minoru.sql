CREATE TABLE `groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`owner_id` text,
	`players` text,
	`game` text,
	`max_players` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text,
	`password` text
);
