-- Initialize Database and Create Events Table with proper Unicode support
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- Create database if it doesn't exist with proper Unicode collation
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HospitalAPI')
BEGIN
    CREATE DATABASE [HospitalAPI]
    COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

USE [HospitalAPI]
GO

-- Create Events table if it doesn't exist with proper Unicode support
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Events')
BEGIN
    CREATE TABLE [dbo].[Events](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Title] NVARCHAR(200) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
        [Subtitle] NVARCHAR(300) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        [Description] NVARCHAR(1000) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        [LongDescription] NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        [EventDate] DATETIME2 NOT NULL,
        [Time] NVARCHAR(10) NULL,
        [Venue] NVARCHAR(200) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        [Trainer] NVARCHAR(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        [IsFree] BIT NOT NULL DEFAULT 1,
        [Price] DECIMAL(10,2) NULL,
        [Currency] NVARCHAR(3) DEFAULT 'AZN',
        [MainImage] NVARCHAR(500) NULL,
        [DetailImageLeft] NVARCHAR(500) NULL,
        [DetailImageMain] NVARCHAR(500) NULL,
        [DetailImageRight] NVARCHAR(500) NULL,
        [IsMain] BIT DEFAULT 0,
        [CreatedAt] DATETIME2 DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT [PK_Events] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    
    PRINT 'Events table created successfully!'
END
ELSE
BEGIN
    PRINT 'Events table already exists!'
END
GO

-- Insert sample data if table is empty with proper Azerbaijani text
IF NOT EXISTS (SELECT * FROM [dbo].[Events])
BEGIN
    INSERT INTO [dbo].[Events] ([Title], [Subtitle], [Description], [LongDescription], [EventDate], [Time], [Venue], [Trainer], [IsFree], [Price], [Currency], [MainImage], [DetailImageLeft], [DetailImageMain], [DetailImageRight], [IsMain]) VALUES
    (N'HPB Cərrahiyyə Hallarının Klinik Təhlili', N'Müasir Diaqnostika və Müalicə Yanaşmaları', N'Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir.', N'Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir. Forumun əsas məqsədi bu sahədə çalışan həkimlər, cərrahlar, radioloqlar, gastroenteroloqlar, onkoloqlar və tədqiqatçıların bilik və təcrübə mübadiləsini təmin etməkdir.', '2025-09-15T14:00:00', '14:00', N'Baku Crystal Hall', N'Yusif Qasımov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 1),
    (N'Kardioloji Təcili Yardım Təcrübələri', N'Müasir Kardioloji Təcili Yardım Metodları', N'Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları haqqında geniş məlumat.', N'Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları haqqında geniş məlumat. Tədbirdə ürək xəstəliklərinin təcili diaqnostikası, müalicəsi və xəstə qayğısı haqqında məlumat veriləcək.', '2025-09-25T10:00:00', '10:00', N'Medical Center Baku', N'Ali Veliyev', 0, 150.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),
    (N'Pediatriya Xəstəliklərinin Diaqnozu', N'Uşaq Sağlamlığında Müasir Diaqnostika', N'Uşaq xəstəliklərinin müasir diaqnostika üsulları və müalicə yanaşmaları haqqında məlumat.', N'Uşaq xəstəliklərinin müasir diaqnostika üsulları və müalicə yanaşmaları haqqında məlumat. Tədbirdə pediatrik diaqnostika texnologiyaları, müasir müalicə protokolları və xəstə qayğısı haqqında geniş məlumat veriləcək.', '2025-10-08T16:00:00', '16:00', N'Children''s Hospital', N'Nurlan Mammadov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0)
    
    PRINT 'Sample data inserted successfully!'
END
ELSE
BEGIN
    PRINT 'Events table already contains data!'
END
GO

-- Verify the setup and check Azerbaijani characters
SELECT 'Database Setup Complete!' as Status
SELECT COUNT(*) as TotalEvents FROM [dbo].[Events]
SELECT 
    Id,
    Title,
    Subtitle,
    Trainer,
    Venue
FROM [dbo].[Events]
GO
