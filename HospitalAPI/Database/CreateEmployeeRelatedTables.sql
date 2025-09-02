-- Create EmployeeDegrees and EmployeeCertificates tables
-- Run this script in SQL Server Management Studio or Azure Data Studio

USE [HospitalAPI]
GO

-- Create EmployeeDegrees table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EmployeeDegrees')
BEGIN
    CREATE TABLE [dbo].[EmployeeDegrees](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [EmployeeId] INT NOT NULL,
        [UniversityName] NVARCHAR(255) NOT NULL,
        [StartYear] INT NOT NULL,
        [EndYear] INT NOT NULL,
        [OrderNumber] INT NOT NULL,
        CONSTRAINT [PK_EmployeeDegrees] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_EmployeeDegrees_Employees] FOREIGN KEY ([EmployeeId]) REFERENCES [dbo].[Employees]([Id]) ON DELETE CASCADE
    )
    
    PRINT 'EmployeeDegrees table created successfully!'
END
ELSE
BEGIN
    PRINT 'EmployeeDegrees table already exists!'
END
GO

-- Create EmployeeCertificates table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EmployeeCertificates')
BEGIN
    CREATE TABLE [dbo].[EmployeeCertificates](
        [Id] INT IDENTITY(1,1) NOT NULL,
        [EmployeeId] INT NOT NULL,
        [CertificateImage] NVARCHAR(500) NOT NULL,
        [CertificateName] NVARCHAR(255) NOT NULL,
        [OrderNumber] INT NOT NULL,
        CONSTRAINT [PK_EmployeeCertificates] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_EmployeeCertificates_Employees] FOREIGN KEY ([EmployeeId]) REFERENCES [dbo].[Employees]([Id]) ON DELETE CASCADE
    )
    
    PRINT 'EmployeeCertificates table created successfully!'
END
ELSE
BEGIN
    PRINT 'EmployeeCertificates table already exists!'
END
GO

-- Insert sample data for Employee ID 1 (Raul Mirzəyev)
IF EXISTS (SELECT * FROM [dbo].[Employees] WHERE Id = 1)
BEGIN
    -- Insert sample degrees for Employee ID 1
    IF NOT EXISTS (SELECT * FROM [dbo].[EmployeeDegrees] WHERE EmployeeId = 1)
    BEGIN
        INSERT INTO [dbo].[EmployeeDegrees] ([EmployeeId], [UniversityName], [StartYear], [EndYear], [OrderNumber]) VALUES
        (1, N'Azərbaycan Tibb Universiteti', 2010, 2016, 1),
        (1, N'Harvard Medical School (Master)', 2016, 2018, 2),
        (1, N'Amerika Hökumət Klinikası', 2019, 2023, 3),
        (1, N'Bakı Klinikası', 2023, 0, 4)
        
        PRINT 'Sample degrees inserted for Employee ID 1'
    END

    -- Insert sample certificates for Employee ID 1
    IF NOT EXISTS (SELECT * FROM [dbo].[EmployeeCertificates] WHERE EmployeeId = 1)
    BEGIN
        INSERT INTO [dbo].[EmployeeCertificates] ([EmployeeId], [CertificateImage], [CertificateName], [OrderNumber]) VALUES
        (1, N'/src/assets/employee-certificate.png', N'Ürək Cərrahiyyəsi Sertifikatı', 1),
        (1, N'/src/assets/employee-certificate.png', N'Kardioloji İxtisas Sertifikatı', 2),
        (1, N'/src/assets/employee-certificate.png', N'Beynəlxalq Tibb Sertifikatı', 3),
        (1, N'/src/assets/employee-certificate.png', N'Minimal İnvaziv Cərrahiyyə', 4),
        (1, N'/src/assets/employee-certificate.png', N'Robotik Cərrahiyyə Sertifikatı', 5),
        (1, N'/src/assets/employee-certificate.png', N'Təcili Tibb Yardımı', 6),
        (1, N'/src/assets/employee-certificate.png', N'Xəstə Qayğısı Sertifikatı', 7),
        (1, N'/src/assets/employee-certificate.png', N'Elmi Tədqiqat Sertifikatı', 8)
        
        PRINT 'Sample certificates inserted for Employee ID 1'
    END
END
GO

-- Verify the setup
SELECT 'Employee related tables setup complete!' as Status
SELECT COUNT(*) as TotalDegrees FROM [dbo].[EmployeeDegrees]
SELECT COUNT(*) as TotalCertificates FROM [dbo].[EmployeeCertificates]

SELECT 
    ed.Id,
    ed.EmployeeId,
    e.Fullname,
    ed.UniversityName,
    ed.StartYear,
    ed.EndYear,
    ed.OrderNumber
FROM [dbo].[EmployeeDegrees] ed
JOIN [dbo].[Employees] e ON ed.EmployeeId = e.Id
ORDER BY ed.EmployeeId, ed.OrderNumber

SELECT 
    ec.Id,
    ec.EmployeeId,
    e.Fullname,
    ec.CertificateName,
    ec.CertificateImage,
    ec.OrderNumber
FROM [dbo].[EmployeeCertificates] ec
JOIN [dbo].[Employees] e ON ec.EmployeeId = e.Id
ORDER BY ec.EmployeeId, ec.OrderNumber
GO
