-- Fix Event Image Paths
-- This script removes the /src/assets/ prefix from image paths in the Events table
-- so they store just the filename instead of the full path

-- First, let's see the current state
SELECT Id, Title, MainImage, DetailImageLeft, DetailImageMain, DetailImageRight 
FROM Events 
ORDER BY Id;

-- Update MainImage paths
UPDATE Events 
SET MainImage = REPLACE(MainImage, '/src/assets/', '')
WHERE MainImage LIKE '/src/assets/%';

-- Update DetailImageLeft paths
UPDATE Events 
SET DetailImageLeft = REPLACE(DetailImageLeft, '/src/assets/', '')
WHERE DetailImageLeft LIKE '/src/assets/%';

-- Update DetailImageMain paths
UPDATE Events 
SET DetailImageMain = REPLACE(DetailImageMain, '/src/assets/', '')
WHERE DetailImageMain LIKE '/src/assets/%';

-- Update DetailImageRight paths
UPDATE Events 
SET DetailImageRight = REPLACE(DetailImageRight, '/src/assets/', '')
WHERE DetailImageRight LIKE '/src/assets/%';

-- Verify the update
SELECT Id, Title, MainImage, DetailImageLeft, DetailImageMain, DetailImageRight 
FROM Events 
ORDER BY Id;

-- Check if there are any remaining full paths
SELECT Id, Title, MainImage, DetailImageLeft, DetailImageMain, DetailImageRight 
FROM Events 
WHERE MainImage LIKE '/src/assets/%' 
   OR DetailImageLeft LIKE '/src/assets/%' 
   OR DetailImageMain LIKE '/src/assets/%' 
   OR DetailImageRight LIKE '/src/assets/%';
