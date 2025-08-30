-- Update Events table to set IsFree based on Price
-- This script ensures that events with price > 0 have IsFree = false
-- and events with price = 0 or null have IsFree = true

UPDATE Events 
SET IsFree = CASE 
    WHEN Price > 0 THEN 0  -- false
    WHEN Price = 0 OR Price IS NULL THEN 1  -- true
    ELSE IsFree  -- keep existing value if price is somehow negative
END;

-- Verify the update
SELECT Id, Title, Price, Currency, IsFree 
FROM Events 
ORDER BY Id;
