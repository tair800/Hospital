-- Create Logos table
CREATE TABLE [dbo].[Logos] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Image] NVARCHAR(500) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Insert sample logo data
INSERT INTO [dbo].[Logos] ([Name], [Image])
VALUES 
(N'Logo 1', N'/src/assets/logo1.png'),
(N'Logo 2', N'/src/assets/logo1.png'),
(N'Logo 3', N'/src/assets/logo1.png'),
(N'Logo 4', N'/src/assets/logo1.png'),
(N'Logo 5', N'/src/assets/logo1.png'),
(N'Logo 6', N'/src/assets/logo1.png'),
(N'Logo 7', N'/src/assets/logo1.png'),
(N'Logo 8', N'/src/assets/logo1.png'),
(N'Logo 9', N'/src/assets/logo1.png'),
(N'Logo 10', N'/src/assets/logo1.png'),
(N'Logo 11', N'/src/assets/logo1.png'),
(N'Logo 12', N'/src/assets/logo1.png'),
(N'Logo 13', N'/src/assets/logo1.png'),
(N'Logo 14', N'/src/assets/logo1.png');
