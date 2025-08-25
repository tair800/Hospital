-- Create Contacts table
CREATE TABLE [dbo].[Contacts] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Type] NVARCHAR(100) NOT NULL,
    [Value] NVARCHAR(200) NOT NULL,
    [Icon] NVARCHAR(100) NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Create SocialMedia table
CREATE TABLE [dbo].[SocialMedia] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Platform] NVARCHAR(50) NOT NULL,
    [Name] NVARCHAR(100) NOT NULL,
    [Url] NVARCHAR(500) NOT NULL,
    [Icon] NVARCHAR(100) NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Create ContactHeadings table
CREATE TABLE [dbo].[ContactHeadings] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Line1] NVARCHAR(100) NOT NULL,
    [Line2] NVARCHAR(100) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Insert sample contact data
INSERT INTO [dbo].[Contacts] ([Type], [Value], [Icon])
VALUES 
(N'phone', N'+(994) 50 xxx xx xx', N'phone-icon.png'),
(N'whatsapp', N'+(994) 50 xxx xx xx', N'whatsapp-icon.png'),
(N'email', N'examplegmail.com', N'mail-icon.png'),
(N'location', N'Bakı, Azərbaycan', N'location-icon.png');

-- Insert sample social media data
INSERT INTO [dbo].[SocialMedia] ([Platform], [Name], [Url], [Icon])
VALUES 
(N'facebook', N'Facebook', N'https://facebook.com/hospital', N'facebook.png'),
(N'instagram', N'Instagram', N'https://instagram.com/hospital', N'instagram.png'),
(N'linkedin', N'LinkedIn', N'https://linkedin.com/company/hospital', N'linkedin.png'),
(N'youtube', N'YouTube', N'https://youtube.com/hospital', N'youtube.png'),
(N'telegram', N'Telegram', N'https://t.me/hospital', N'telegram.png');

-- Insert sample contact heading data
INSERT INTO [dbo].[ContactHeadings] ([Line1], [Line2])
VALUES (N'Nə sualın varsa,', N'buradayıq!');
