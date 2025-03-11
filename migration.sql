-- Step 1: Create a new temporary table with the desired schema
CREATE TABLE order_items_new (
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY(item_id) REFERENCES items (id),
    FOREIGN KEY(order_id) REFERENCES orders (id)
);

-- Step 2: Copy the data from the old table to the new table, setting quantity to 1
INSERT INTO order_items_new (order_id, item_id, quantity)
SELECT order_id, item_id, 1 FROM order_items;

-- Step 3: Drop the old table
DROP TABLE order_items;

-- Step 4: Rename the new table to the original name
ALTER TABLE order_items_new RENAME TO order_items;

-- Step 5: Verify the migration was successful
PRAGMA table_info(order_items);

