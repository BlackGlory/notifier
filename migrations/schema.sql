--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

PRAGMA journal_mode = WAL;

CREATE TABLE notification (
  id        INTEGER PRIMARY KEY AUTOINCREMENT
, timestamp INTEGER NOT NULL
, title     TEXT
, message   TEXT
, icon_url  TEXT
, image_url TEXT
, url       TEXT
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE notification;
