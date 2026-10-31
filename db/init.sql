CREATE TABLE criminals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  nickname VARCHAR(255) NOT NULL,
  reward INTEGER NOT NULL CHECK (reward >= 0),
  last_latitude DOUBLE PRECISION,
  last_longitude DOUBLE PRECISION,
  last_known_note TEXT,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
  armed BOOLEAN NOT NULL DEFAULT FALSE,
  has_crew BOOLEAN NOT NULL DEFAULT FALSE,
  escape_master BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE hunt_logs (
  id SERIAL PRIMARY KEY,
  criminal_id INTEGER NOT NULL REFERENCES criminals(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO criminals (name, nickname, reward, last_latitude, last_longitude, last_known_note, difficulty, armed, has_crew, escape_master) VALUES
  ('Rax Vellan', 'Red Comet', 15000, 12.4512, -45.2231, NULL, 8, TRUE, TRUE, FALSE),
  (NULL, 'Ghost of Kepler', 30000, NULL, NULL, 'Seen near the Kepler-22 trading station', 10, TRUE, FALSE, TRUE),
  ('Mira Sol', 'Starlight', 4000, 33.1200, 78.9100, NULL, 3, FALSE, FALSE, TRUE),
  ('Dorn Kask', 'Iron Fist', 8000, -10.5000, 20.7500, NULL, 6, TRUE, TRUE, FALSE),
  (NULL, 'Silent Wing', 2500, NULL, NULL, 'Hiding somewhere in the Orion asteroid belt', 2, FALSE, TRUE, FALSE),
  ('Tal Morrow', 'Void Fox', 12000, 55.0000, -120.3000, NULL, 7, FALSE, FALSE, TRUE);

INSERT INTO hunt_logs (criminal_id, success, notes) VALUES
  (1, FALSE, 'Target escaped in a stolen freighter.'),
  (1, FALSE, 'Ambushed by his crew near Mars orbit.'),
  (2, FALSE, 'Lost the signal in a nebula.'),
  (2, FALSE, 'Target escaped through an asteroid field.'),
  (3, TRUE, 'Captured at a space port without resistance.'),
  (4, FALSE, 'Too many armed crew members, retreated.'),
  (4, TRUE, 'Captured after a long fight on the moon base.'),
  (5, FALSE, 'Wrong coordinates, nobody there.'),
  (6, FALSE, 'Target used a smoke screen and vanished.'),
  (6, TRUE, 'Trapped in a docking bay and captured.');
