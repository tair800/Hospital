-- Create AboutCarousel table
CREATE TABLE [dbo].[AboutCarousel] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Image] NVARCHAR(500) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Insert sample about carousel data
INSERT INTO [dbo].[AboutCarousel] ([Name], [Image])
VALUES 
(N'Medical Conference 2024', N'/src/assets/about-slider1.png'),
(N'Surgical Workshop', N'/src/assets/about-slider2.png'),
(N'Research Symposium', N'/src/assets/about-slider3.png'),
(N'Healthcare Innovation', N'/src/assets/about-slider4.png'),
(N'Medical Conference 2024', N'/src/assets/about-slider1.png'),
(N'Surgical Workshop', N'/src/assets/about-slider2.png'),
(N'Research Symposium', N'/src/assets/about-slider3.png'),
(N'Healthcare Innovation', N'/src/assets/about-slider4.png');
