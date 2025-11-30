-- 1. Create the Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Stores the hashed password
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---

-- 2. Create the Boards Table
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- If owner is deleted, boards are deleted
    background_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---

-- 3. Create the Board Members (Join Table)
-- This allows multiple users to collaborate on a single board
CREATE TABLE board_members (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- e.g., 'admin', 'member'
    PRIMARY KEY (user_id, board_id) -- Composite Primary Key
);

---

-- 4. Create the Lists Table
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE, -- If board is deleted, lists are deleted
    title VARCHAR(255) NOT NULL,
    position REAL NOT NULL, -- Used for horizontal ordering (drag-and-drop)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---

-- 5. Create the Cards Table
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE, -- If list is deleted, cards are deleted
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position REAL NOT NULL, -- Used for vertical ordering within a list (drag-and-drop)
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---

-- 6. Optional: Create Labels Table
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL -- e.g., '#4CAF50'
);

---

-- 7. Optional: Card Labels Join Table
-- Allows a card to have multiple labels and a label to be on multiple cards
CREATE TABLE card_labels (
    card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
    label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, label_id)
);