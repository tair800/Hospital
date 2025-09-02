-- Create Employee table for Hospital API
-- Run this script in SQL Server Management Studio or Azure Data Studio

USE [HospitalAPI]
GO

-- Create Employee table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employees')
BEGIN
    CREATE TABLE [dbo].[Employees](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Fullname] NVARCHAR(255) NOT NULL,
        [Field] NVARCHAR(255) NOT NULL,
        [Clinic] NVARCHAR(255) NOT NULL,
        [Image] NVARCHAR(500) NULL,
        [DetailImage] NVARCHAR(500) NULL,
        [Phone] NVARCHAR(50) NULL,
        [WhatsApp] NVARCHAR(50) NULL,
        [Email] NVARCHAR(255) NULL,
        [Location] NVARCHAR(255) NULL,
        [FirstDesc] NVARCHAR(MAX) NULL,
        [SecondDesc] NVARCHAR(MAX) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Employees] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
    
    PRINT 'Employees table created successfully!'
END
ELSE
BEGIN
    PRINT 'Employees table already exists!'
END
GO

-- Insert sample employee data if table is empty
IF NOT EXISTS (SELECT * FROM [dbo].[Employees])
BEGIN
    INSERT INTO [dbo].[Employees] ([Fullname], [Field], [Clinic], [Image], [DetailImage], [Phone], [WhatsApp], [Email], [Location], [FirstDesc], [SecondDesc]) VALUES
    (N'Əli Məmmədov', N'Ürək-damar cərrahı', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 123 45 67', N'+(994) 50 123 45 67', N'ali.mammadov@hospital.az', N'Bakı, Azərbaycan', N'Əli Məmmədov 15 ildən çox təcrübəyə malik ürək-damar cərrahıdır. O, müasir cərrahiyyə texnologiyalarında ixtisaslaşmışdır və minlərlə uğurlu əməliyyat keçirmişdir.', N'Dr. Məmmədov beynəlxalq konfranslarda iştirak edir və elmi tədqiqatlarda fəal iştirakçıdır. O, xəstələrinə ən yaxşı müalicə təmin etmək üçün daim öz biliklərini yeniləyir.'),
    (N'Dr. Leyla Əliyeva', N'Nevrolog', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 234 56 78', N'+(994) 50 234 56 78', N'leyla.aliyeva@hospital.az', N'Bakı, Azərbaycan', N'Dr. Leyla Əliyeva nevrologiya sahəsində 12 ildən çox təcrübəyə malikdir. O, beyin və sinir sistemi xəstəliklərinin müalicəsində ixtisaslaşmışdır.', N'Dr. Əliyeva müasir diaqnostika üsullarından istifadə edərək xəstələrinə dəqiq diaqnoz qoyur və effektiv müalicə təmin edir.'),
    (N'Prof. Rəşad Həsənov', N'Ortoped', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 345 67 89', N'+(994) 50 345 67 89', N'rashad.hasanov@hospital.az', N'Bakı, Azərbaycan', N'Prof. Rəşad Həsənov ortopediya sahəsində 20 ildən çox təcrübəyə malikdir. O, sümük-əzələ sistemi xəstəliklərinin müalicəsində mütəxəssisdir.', N'Prof. Həsənov robotik cərrahiyyə və minimal invaziv üsullarda ixtisaslaşmışdır. O, beynəlxalq elmi jurnallarda məqalələr dərc etmişdir.'),
    (N'Dr. Aysel Məmmədova', N'Pediatr', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 456 78 90', N'+(994) 50 456 78 90', N'aysel.mammadova@hospital.az', N'Bakı, Azərbaycan', N'Dr. Aysel Məmmədova pediatriya sahəsində 10 ildən çox təcrübəyə malikdir. O, uşaq xəstəliklərinin müalicəsində ixtisaslaşmışdır.', N'Dr. Məmmədova uşaqlarla işləməkdə böyük təcrübəyə malikdir və valideynlərlə sıx əməkdaşlıq edir.'),
    (N'Dr. Elvin Quliyev', N'Kardioloq', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 567 89 01', N'+(994) 50 567 89 01', N'elvin.guliyev@hospital.az', N'Bakı, Azərbaycan', N'Dr. Elvin Quliyev kardioloji sahədə 8 ildən çox təcrübəyə malikdir. O, ürək xəstəliklərinin diaqnostikası və müalicəsində ixtisaslaşmışdır.', N'Dr. Quliyev müasir kardioloji texnologiyalardan istifadə edərək xəstələrinə yüksək keyfiyyətli xidmət təmin edir.'),
    (N'Dr. Nigar Rəhimova', N'Ginekoloq', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 678 90 12', N'+(994) 50 678 90 12', N'nigar.rahimova@hospital.az', N'Bakı, Azərbaycan', N'Dr. Nigar Rəhimova ginekologiya sahəsində 14 ildən çox təcrübəyə malikdir. O, qadın sağlamlığı və reproduktiv sistem xəstəliklərinin müalicəsində ixtisaslaşmışdır.', N'Dr. Rəhimova qadınlara həssas yanaşma ilə xidmət göstərir və müasir ginekoloji müalicə üsullarından istifadə edir.'),
    (N'Prof. Tural Əliyev', N'Onkoloq', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 789 01 23', N'+(994) 50 789 01 23', N'tural.aliyev@hospital.az', N'Bakı, Azərbaycan', N'Prof. Tural Əliyev onkologiya sahəsində 18 ildən çox təcrübəyə malikdir. O, xərçəng xəstəliklərinin müalicəsində mütəxəssisdir.', N'Prof. Əliyev müasir onkoloji müalicə protokollarından istifadə edərək xəstələrinə ən yaxşı nəticələr təmin edir.'),
    (N'Dr. Səbinə Hüseynova', N'Dermatoloq', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 890 12 34', N'+(994) 50 890 12 34', N'sabina.huseynova@hospital.az', N'Bakı, Azərbaycan', N'Dr. Səbinə Hüseynova dermatologiya sahəsində 9 ildən çox təcrübəyə malikdir. O, dəri xəstəliklərinin müalicəsində ixtisaslaşmışdır.', N'Dr. Hüseynova müasir dermatoloji texnologiyalardan istifadə edərək dəri problemlərini effektiv həll edir.'),
    (N'Dr. Rəvan Məlikov', N'Urolog', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 901 23 45', N'+(994) 50 901 23 45', N'revan.malikov@hospital.az', N'Bakı, Azərbaycan', N'Dr. Rəvan Məlikov urologiya sahəsində 11 ildən çox təcrübəyə malikdir. O, sidik-cinsiyyət sistemi xəstəliklərinin müalicəsində ixtisaslaşmışdır.', N'Dr. Məlikov minimal invaziv uroloji əməliyyatlarda ixtisaslaşmışdır və xəstələrinə təhlükəsiz müalicə təmin edir.'),
    (N'Dr. Günel Vəliyeva', N'Endokrinoloq', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 012 34 56', N'+(994) 50 012 34 56', N'gunel.valiyeva@hospital.az', N'Bakı, Azərbaycan', N'Dr. Günel Vəliyeva endokrinologiya sahəsində 7 ildən çox təcrübəyə malikdir. O, hormon xəstəliklərinin müalicəsində ixtisaslaşmışdır.', N'Dr. Vəliyeva diabet və digər endokrin xəstəliklərin müalicəsində müasir yanaşmalardan istifadə edir.'),
    (N'Dr. Orxan Əliyev', N'Psixiatr', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 123 45 67', N'+(994) 50 123 45 67', N'orxan.aliyev@hospital.az', N'Bakı, Azərbaycan', N'Dr. Orxan Əliyev psixiatriya sahəsində 13 ildən çox təcrübəyə malikdir. O, ruhi xəstəliklərin müalicəsində ixtisaslaşmışdır.', N'Dr. Əliyev xəstələrinə psixoloji dəstək göstərir və müasir psixiatrik müalicə üsullarından istifadə edir.'),
    (N'Dr. Aynur Məmmədova', N'Anesteziolog', N'Bakı Klinikası', N'/src/assets/employee1.png', N'/src/assets/employee1.png', N'+(994) 50 234 56 78', N'+(994) 50 234 56 78', N'aynur.mammadova@hospital.az', N'Bakı, Azərbaycan', N'Dr. Aynur Məmmədova anesteziologiya sahəsində 16 ildən çox təcrübəyə malikdir. O, əməliyyat zamanı xəstələrin ağrısız olmasını təmin edir.', N'Dr. Məmmədova müasir anesteziya texnologiyalarından istifadə edərək xəstələrinə təhlükəsiz və rahat əməliyyat təcrübəsi təmin edir.')
    
    PRINT 'Sample employee data inserted successfully!'
END
ELSE
BEGIN
    PRINT 'Employees table already contains data!'
END
GO

-- Verify the setup
SELECT 'Employee table setup complete!' as Status
SELECT COUNT(*) as TotalEmployees FROM [dbo].[Employees]
SELECT 
    Id,
    Fullname,
    Field,
    Clinic
FROM [dbo].[Employees]
GO
