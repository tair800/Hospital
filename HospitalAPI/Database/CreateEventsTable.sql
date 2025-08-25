-- Create Events table with proper collation for Azerbaijani letters
-- Run this script in your SQL Server database

USE [HospitalDB]  -- Change this to your database name
GO

-- Create Events table
CREATE TABLE [dbo].[Events](
    [Id] INT IDENTITY(1,1) NOT NULL,
    [Title] NVARCHAR(200) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    [Subtitle] NVARCHAR(300) COLLATE SQL_Latin1_General_CP1254_CI_AS NULL,
    [Description] NVARCHAR(1000) COLLATE SQL_Latin1_General_CP1254_CI_AS NULL,
    [LongDescription] NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1254_CI_AS NULL,
    [EventDate] DATETIME2 NOT NULL,
    [Time] NVARCHAR(10) NULL,
    [Venue] NVARCHAR(200) COLLATE SQL_Latin1_General_CP1254_CI_AS NULL,
    [Trainer] NVARCHAR(100) COLLATE SQL_Latin1_General_CP1254_CI_AS NULL,
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
GO

-- Insert sample data with Azerbaijani letters
INSERT INTO [dbo].[Events] ([Title], [Subtitle], [Description], [LongDescription], [EventDate], [Time], [Venue], [Trainer], [IsFree], [Price], [Currency], [MainImage], [DetailImageLeft], [DetailImageMain], [DetailImageRight], [IsMain]) VALUES
('HPB Cərrahiyyə Hallarının Klinik Təhlili', 'Müasir Diaqnostika və Müalicə Yanaşmaları', 'Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir.', 'Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir. Forumun əsas məqsədi bu sahədə çalışan həkimlər, cərrahlar, radioloqlar, gastroenteroloqlar, onkoloqlar və tədqiqatçıların bilik və təcrübə mübadiləsini təmin etməkdir.', '2025-09-15T14:00:00', '14:00', 'Baku Crystal Hall', 'Yusif Qasımov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 1),
('Kardioloji Təcili Yardım Təcrübələri', 'Müasir Kardioloji Təcili Yardım Metodları', 'Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları haqqında geniş məlumat.', 'Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları haqqında geniş məlumat. Tədbirdə ürək xəstəliklərinin təcili diaqnostikası, müalicəsi və xəstə qayğısı haqqında məlumat veriləcək.', '2025-09-25T10:00:00', '10:00', 'Medical Center Baku', 'Ali Veliyev', 0, 150.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),
('Pediatriya Xəstəliklərinin Diaqnozu', 'Uşaq Sağlamlığında Müasir Diaqnostika', 'Uşaq xəstəliklərinin müasir diaqnostika üsulları və müalicə yanaşmaları haqqında məlumat.', 'Uşaq xəstəliklərinin müasir diaqnostika üsulları və müalicə yanaşmaları haqqında məlumat. Tədbirdə pediatrik diaqnostika texnologiyaları, müasir müalicə protokolları və xəstə qayğısı haqqında geniş məlumat veriləcək.', '2025-10-08T16:00:00', '16:00', 'Children''s Hospital', 'Nurlan Mammadov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0)
GO

-- Verify the data was inserted correctly
SELECT * FROM [dbo].[Events]
GO
