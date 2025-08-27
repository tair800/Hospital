-- Test Unicode Support for Azerbaijani Characters using SQL_Latin1_General_CP1254_CI_AS
-- This script tests if the database properly handles Turkish/Azerbaijani characters

-- Test 1: Check current database collation
SELECT 
    name AS DatabaseName,
    collation_name AS CurrentCollation
FROM sys.databases 
WHERE name = 'HospitalAPI';

-- Test 2: Check if Contacts table exists and has proper collation
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Contacts')
BEGIN
    SELECT 
        c.name AS ColumnName,
        t.name AS DataType,
        c.collation_name AS ColumnCollation,
        c.max_length AS MaxLength
    FROM sys.columns c
    INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
    WHERE c.object_id = OBJECT_ID('Contacts')
    ORDER BY c.column_id;
END
ELSE
BEGIN
    PRINT 'Contacts table does not exist yet.';
END

-- Test 3: Insert test data with Azerbaijani characters
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Contacts')
BEGIN
    -- Test insert with Azerbaijani characters
    INSERT INTO Contacts (Type, Value, Icon) VALUES
    ('test_location', N'Bakı, Azərbaycan - Test', 'test-icon.png');
    
    PRINT 'Test data inserted successfully.';
    
    -- Verify the data was stored correctly
    SELECT Type, Value FROM Contacts WHERE Type = 'test_location';
    
    -- Clean up test data
    DELETE FROM Contacts WHERE Type = 'test_location';
    PRINT 'Test data cleaned up.';
END

-- Test 4: Check if we can read Azerbaijani characters from existing data
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Contacts')
BEGIN
    SELECT 'Current Contacts Data:' AS Info;
    SELECT Type, Value FROM Contacts ORDER BY Type;
END

PRINT 'Unicode support test completed.';
PRINT 'If you see "Bakı, Azərbaycan" correctly, Unicode is working!';
