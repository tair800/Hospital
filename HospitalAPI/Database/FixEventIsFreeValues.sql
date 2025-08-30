-- Fix Event IsFree values based on Price
-- This script ensures that events with price > 0 have IsFree = false
-- and events with price = 0 or null have IsFree = true

-- First, let's see the current state
SELECT Id, Title, Price, Currency, IsFree 
FROM Events 
ORDER BY Id;

-- Update IsFree based on Price
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

-- Check if there are any events with price > 0 but IsFree = true
SELECT Id, Title, Price, Currency, IsFree 
FROM Events 
WHERE Price > 0 AND IsFree = 1;

-- Check if there are any events with price = 0 or null but IsFree = false
SELECT Id, Title, Price, Currency, IsFree 
FROM Events 
WHERE (Price = 0 OR Price IS NULL) AND IsFree = 0;
