-- Create all tables including the new Contacts table
-- This script creates all necessary tables for the Hospital API

-- Create Contacts table
CREATE TABLE Contacts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Type NVARCHAR(50) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Value NVARCHAR(500) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Icon NVARCHAR(100) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create Events table
CREATE TABLE Events (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Subtitle NVARCHAR(300),
    Description NVARCHAR(1000),
    Venue NVARCHAR(200),
    Trainer NVARCHAR(100),
    Time NVARCHAR(10),
    Currency NVARCHAR(3),
    MainImage NVARCHAR(500),
    DetailImageLeft NVARCHAR(500),
    DetailImageMain NVARCHAR(500),
    DetailImageRight NVARCHAR(500),
    Price DECIMAL(10,2),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create Blogs table
CREATE TABLE Blogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Number NVARCHAR(10) NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(500),
    Date NVARCHAR(50) NOT NULL,
    SecondDescTitle NVARCHAR(200),
    SecondDescBody NVARCHAR(1000),
    ThirdTextTitle NVARCHAR(200),
    ThirdTextBody NVARCHAR(1000),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create Logos table
CREATE TABLE Logos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Image NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create AboutCarousel table
CREATE TABLE AboutCarousel (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Image NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Create About table
CREATE TABLE About (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(500) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Img NVARCHAR(500) NOT NULL
);

-- Insert sample contact data
INSERT INTO Contacts (Type, Value, Icon) VALUES
('phone', '+(994) 50 xxx xx xx', 'phone-icon.png'),
('whatsapp', '+(994) 50 xxx xx xx', 'whatsapp-icon.png'),
('email', 'example@gmail.com', 'mail-icon.png'),
('location', 'Bakı, Azərbaycan', 'location-icon.png'),
('facebook', 'https://facebook.com/hospital', 'facebook.png'),
('instagram', 'https://instagram.com/hospital', 'instagram.png'),
('linkedin', 'https://linkedin.com/company/hospital', 'linkedin.png'),
('youtube', 'https://youtube.com/hospital', 'youtube.png'),
('telegram', 'https://t.me/hospital', 'telegram.png');

-- Create indexes for better performance
CREATE INDEX IX_Contacts_Type ON Contacts(Type);
CREATE INDEX IX_Events_Title ON Events(Title);
CREATE INDEX IX_Blogs_Title ON Blogs(Title);
CREATE INDEX IX_Logos_Name ON Logos(Name);
CREATE INDEX IX_AboutCarousel_Name ON AboutCarousel(Name);
CREATE INDEX IX_About_Title ON About(Title);

-- Optional: Add unique constraint on Contact Type if you want each type to be unique
-- ALTER TABLE Contacts ADD CONSTRAINT UQ_Contacts_Type UNIQUE (Type);

PRINT 'All tables created successfully with sample contact data!';
