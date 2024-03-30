CREATE TABLE IF NOT EXISTS member_detail(
 id_channels VARCHAR(100) NOT NULL,
 id_users VARCHAR(100) NOT NULL,
 PRIMARY KEY(id_channels, id_users),
 CONSTRAINT fk_channel_id FOREIGN KEY (id_channels) REFERENCES channels(id) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT fk_user_id FOREIGN KEY (id_users) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);