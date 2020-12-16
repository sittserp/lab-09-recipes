DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[]
);

CREATE TABLE logs (
  recipe_id BIGINT,
  date_of_event TEXT,
  notes TEXT,
  rating TEXT
);
