-- Create About Table with new structure
-- Single Description field instead of multiple paragraph fields

CREATE TABLE About (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(500) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Description NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Img NVARCHAR(500) NOT NULL
);

-- Insert sample data with proper Unicode handling
-- Description contains all three paragraphs separated by double line breaks for proper spacing
INSERT INTO About (Title, Description, Img) VALUES 
(
    N'Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi',
    N'Azərbaycan Hepato-Pankreato-Biliar Cərrahlar İctimai Birliyi, qaraciyər, öd yolları və mədəaltı vəzi xəstəliklərinin diaqnostika və cərrahiyyəsi sahəsində fəaliyyət göstərən mütəxəssisləri bir araya gətirən elmi-ictimai təşkilatdır.

Birliyin əsas məqsədi HPB sahəsində bilik və təcrübə mübadiləsini təşviq etmək, peşəkar inkişafı dəstəkləmək və ölkədə bu sahənin inkişafına töhfə verməkdir. Birlik həm yerli, həm də beynəlxalq əməkdaşlıqlar quraraq seminarlar, elmi konfranslar və təlimlər təşkil edir. Gənc cərrahların və mütəxəssislərin dəstəklənməsi, müasir cərrahiyyə metodlarının tətbiqi və elmi tədqiqatların təşviqi də fəaliyyətimizin əsas istiqamətlərindəndir.

Azərbaycan HPB Cərrahları İctimai Birliyi olaraq, səhiyyə sisteminə dəyər qatmaq və xəstələrin həyat keyfiyyətini artırmaq üçün peşəkar bir cəmiyyət olaraq çalışırıq.',
    'about-main.png'
);

-- Verify the table structure and data
SELECT * FROM About;
