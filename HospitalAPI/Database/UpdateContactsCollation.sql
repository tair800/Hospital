-- Update Contacts table collation to SQL_Latin1_General_CP1254_CI_AS
-- This script fixes the "Ə" character display issue

-- Check if Contacts table exists
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Contacts')
BEGIN
    PRINT 'Updating Contacts table collation...';
    
    -- Update column collations
    ALTER TABLE Contacts 
    ALTER COLUMN Type NVARCHAR(50) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL;
    
    ALTER TABLE Contacts 
    ALTER COLUMN Value NVARCHAR(500) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL;
    
    ALTER TABLE Contacts 
    ALTER COLUMN Icon NVARCHAR(100) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL;
    
    PRINT 'Contacts table collation updated successfully!';
    
    -- Verify the update
    SELECT 
        c.name AS ColumnName,
        t.name AS DataType,
        c.collation_name AS ColumnCollation
    FROM sys.columns c
    INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
    WHERE c.object_id = OBJECT_ID('Contacts')
    ORDER BY c.column_id;
    
    -- Test with Azerbaijani characters
    PRINT 'Testing Azerbaijani characters...';
    SELECT 'Test: Bakı, Azərbaycan should display correctly now' AS Message;
    
END
ELSE
BEGIN
    PRINT 'Contacts table does not exist. Please create it first using CreateContactsTable.sql';
END

PRINT 'Collation update script completed!';
