-- Remove OrderIndex column from Gallery table
-- This script removes the OrderIndex column that is no longer needed

-- Check if OrderIndex column exists before removing it
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Gallery' 
    AND COLUMN_NAME = 'OrderIndex'
)
BEGIN
    -- Remove the OrderIndex column
    ALTER TABLE Gallery DROP COLUMN OrderIndex;
    PRINT 'OrderIndex column removed from Gallery table successfully.';
END
ELSE
BEGIN
    PRINT 'OrderIndex column does not exist in Gallery table.';
END

-- Verify the table structure
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Gallery'
ORDER BY ORDINAL_POSITION;
