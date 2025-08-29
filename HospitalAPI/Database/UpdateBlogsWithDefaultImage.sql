-- Update all existing blog records with default image
-- This script sets 'blog1.png' as the default image for all blogs that don't have an image

USE [HospitalAPI]
GO

-- First, let's see the current state of the Image column
SELECT [Id], [Title], [Image] 
FROM [dbo].[Blogs] 
ORDER BY [Id];

-- Update all blogs to have 'blog1.png' as the default image
UPDATE [dbo].[Blogs]
SET [Image] = 'blog1.png'
WHERE [Image] IS NULL OR [Image] = '';

-- Verify the update was successful
SELECT [Id], [Title], [Image] 
FROM [dbo].[Blogs] 
ORDER BY [Id];

-- Show count of updated records
SELECT COUNT(*) as 'Total Blogs Updated'
FROM [dbo].[Blogs] 
WHERE [Image] = 'blog1.png';

-- Show the final table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Blogs'
ORDER BY ORDINAL_POSITION;
