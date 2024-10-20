CREATE TABLE `groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`owner_id` integer,
	`game` text,
	`max_players` integer,
	`date` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text,
	`password` text,
	`username_token` text
);
--> statement-breakpoint
CREATE TABLE `users_to_groups` (
	`squad_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`squad_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
