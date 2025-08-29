-- Add Image column to Blogs table
-- This script adds the missing Image column to the existing Blogs table

USE [HospitalAPI]
GO

-- Add Image column to Blogs table
ALTER TABLE [dbo].[Blogs]
ADD [Image] NVARCHAR(500) NULL;

-- Add a comment to document the column
EXEC sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'Image filename for the blog post',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Blogs',
    @level2type = N'COLUMN',
    @level2name = N'Image';

-- Verify the column was added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Blogs' AND COLUMN_NAME = 'Image';

-- Show the updated table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Blogs'
ORDER BY ORDINAL_POSITION;
