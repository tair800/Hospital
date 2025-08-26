-- Update About Table Structure
-- This script will modify the existing About table to use a single Description field

-- First, add the new Description column
ALTER TABLE About ADD Description NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1254_CI_AS NULL;

-- Update the Description field with combined content from existing fields
UPDATE About 
SET Description = SubText + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10) + SecondParagraph + CHAR(13) + CHAR(10) + CHAR(13) + CHAR(10) + ThirdParagraph;

-- Make Description NOT NULL after populating it
ALTER TABLE About ALTER COLUMN Description NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL;

-- Remove the old columns
ALTER TABLE About DROP COLUMN SubText;
ALTER TABLE About DROP COLUMN SecondParagraph;
ALTER TABLE About DROP COLUMN ThirdParagraph;

-- Verify the table structure
SELECT * FROM About;
