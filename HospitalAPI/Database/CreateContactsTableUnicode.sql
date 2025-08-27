-- Create Contacts table with proper Unicode support for Azerbaijani characters
-- This script ensures proper handling of characters like "Ə", "ə", "Ğ", "ğ", etc.

-- Set database collation to support Azerbaijani characters
-- You can run this if you have permission to change database collation
-- ALTER DATABASE HospitalAPI COLLATE Azerbaijani_100_CI_AS;

-- Create Contacts table with Unicode support
CREATE TABLE Contacts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Type NVARCHAR(50) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Value NVARCHAR(500) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Icon NVARCHAR(100) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Insert sample data with proper Azerbaijani characters
INSERT INTO Contacts (Type, Value, Icon) VALUES
('phone', '+(994) 50 xxx xx xx', 'phone-icon.png'),
('whatsapp', '+(994) 50 xxx xx xx', 'whatsapp-icon.png'),
('email', 'example@gmail.com', 'mail-icon.png'),
('location', N'Bakı, Azərbaycan', 'location-icon.png'),
('facebook', 'https://facebook.com/hospital', 'facebook.png'),
('instagram', 'https://instagram.com/hospital', 'instagram.png'),
('linkedin', 'https://linkedin.com/company/hospital', 'linkedin.png'),
('youtube', 'https://youtube.com/hospital', 'youtube.png'),
('telegram', 'https://t.me/hospital', 'telegram.png');

-- Create index on Type for faster lookups
CREATE INDEX IX_Contacts_Type ON Contacts(Type);

-- Test Unicode support
-- This should display properly: "Bakı, Azərbaycan"
SELECT Type, Value FROM Contacts WHERE Type = 'location';

-- Optional: Add constraint to ensure Type values are unique
-- ALTER TABLE Contacts ADD CONSTRAINT UQ_Contacts_Type UNIQUE (Type);

PRINT 'Contacts table created with Unicode support for Azerbaijani characters!';
PRINT 'Test: Bakı, Azərbaycan should display correctly.';
