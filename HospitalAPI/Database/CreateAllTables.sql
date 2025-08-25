-- Create all new tables for Hospital API
-- This script creates tables for Blogs, Contacts, SocialMedia, ContactHeadings, Logos, and AboutCarousel

-- Create Blogs table
CREATE TABLE [dbo].[Blogs] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Number] NVARCHAR(10) NOT NULL,
    [Title] NVARCHAR(300) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [Date] NVARCHAR(50) NOT NULL,
    [Visitors] INT NOT NULL DEFAULT 0,
    [SecondDescTitle] NVARCHAR(200) NULL,
    [SecondDescBody] NVARCHAR(1000) NULL,
    [ThirdTextTitle] NVARCHAR(200) NULL,
    [ThirdTextBody] NVARCHAR(1000) NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

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

-- Create Logos table
CREATE TABLE [dbo].[Logos] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL,
    [Image] NVARCHAR(500) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Create AboutCarousel table
CREATE TABLE [dbo].[AboutCarousel] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Image] NVARCHAR(500) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Insert sample blog data
INSERT INTO [dbo].[Blogs] ([Number], [Title], [Description], [Date], [Visitors], [SecondDescTitle], [SecondDescBody], [ThirdTextTitle], [ThirdTextBody])
VALUES 
('01', N'HPB Cərrahiyyə Hallarının Klinik Təhlili', N'Yeni texnologiyalardan istifadə edərək öd yolları sistemi xəstəliklərinin diaqnozu və müalicəsi haqqında panel və workshop-larda iştirakçılar real klinik təcrübə qazanırlar.', N'5 Sentyabr 2025', 28, N'HPB Cərrahiyyəsinin Əhəmiyyəti', N'HPB cərrahiyyəsi müasir tibb sahəsində ən çətin və mürəkkəb əməliyyatlardan biridir. Bu sahədə ixtisaslaşmış cərrahlar yüksək texniki bacarıq və geniş anatomiya biliklərinə malik olmalıdır. Qaraciyər, öd yolları və pankreas orqanlarının xəstəlikləri tez-tez həyatı təhlükə altına qoyan vəziyyətlər yaradır.', N'Müasir Texnologiyalar və Üsullar', N'Müasir HPB cərrahiyyəsində laparoskopik və robotik əməliyyat üsulları geniş istifadə olunur. Bu texnologiyalar xəstələrə daha az travmatik, daha tez sağalma və daha yaxşı nəticələr təmin edir. Həmçinin, 3D görüntüləmə və navigasiya sistemləri dəqiq diaqnostika və təhlükəsiz əməliyyat üçün vacibdir.'),
('02', N'Kardioloji Xəstəliklərin Müasir Müalicəsi', N'Ürək-damar sistemi xəstəliklərinin diaqnozu və müalicəsində ən son texnologiyaların tətbiqi haqqında məlumat verilir.', N'3 Sentyabr 2025', 45, N'Kardioloji Müalicənin Əsasları', N'Ürək-damar sistemi xəstəlikləri dünyada ən çox ölümə səbəb olan xəstəliklər sırasında birinci yerdə durur. Bu səbəbdən kardioloji sahədə müasir diaqnostika və müalicə üsullarının tətbiqi xüsusi əhəmiyyət kəsb edir.', N'İnnovativ Kardioloji Texnologiyaları', N'Müasir kardioloji müalicədə stentlərin tətbiqi, ürək kateterizasiyası və ürək cərrahiyyəsi sahəsində böyük irəliləyişlər əldə edilib. Həmçinin, telemedisina vasitəsilə məsafədən monitorinq də geniş istifadə olunur.'),
('03', N'Onkologiya Sahəsində Yeni Üsullar', N'Xərçəng xəstəliklərinin erkən diaqnozu və müalicəsində innovativ yanaşmalar və yeni dərmanlar haqqında məlumat.', N'1 Sentyabr 2025', 67, N'Onkologiya Müalicəsinin Təkamülü', N'Onkologiya sahəsində son illərdə böyük irəliləyişlər əldə edilib. Erkən diaqnoz və müasir müalicə üsulları xərçəng xəstəliklərindən sağalma şansını əhəmiyyətli dərəcədə artırır.', N'Personalizasiya Edilmiş Onkologiya', N'Müasir onkologiya müalicəsində hər xəstənin genetik xüsusiyyətlərinə uyğun personalizasiya edilmiş müalicə planları hazırlanır. Bu yanaşma müalicənin effektivliyini artırır və yan təsirləri azaldır.'),
('04', N'Nevroloji Reabilitasiya Texnikaları', N'Beyin və sinir sistemi xəstəliklərindən sonra funksiyaların bərpası üçün müasir reabilitasiya üsulları və texnikaları.', N'29 Avqust 2025', 34, N'Nevroloji Reabilitasiyanın Əhəmiyyəti', N'Beyin və sinir sistemi xəstəliklərindən sonra funksiyaların bərpası üçün reabilitasiya vacibdir. Bu proses xəstənin gündəlik həyat fəaliyyətlərinə qayıtmasına kömək edir.', N'Müasir Reabilitasiya Texnikaları', N'Müasir nevroloji reabilitasiyada robotik cihazlar, virtual reallıq texnologiyaları və beyin-bilgisayar interfeysi geniş istifadə olunur. Bu texnologiyalar reabilitasiya prosesini daha effektiv edir.'),
('05', N'Endoskopik Cərrahiyyə İnnovasiyaları', N'Minimal invaziv cərrahiyyə üsullarında ən son texnologiyalar və endoskopik cihazların tətbiqi.', N'27 Avqust 2025', 52, N'Endoskopik Cərrahiyyənin Üstünlükləri', N'Endoskopik cərrahiyyə minimal invaziv üsuldur ki, xəstələrə daha az travmatik, daha tez sağalma və daha az ağrı təmin edir. Bu üsul müasir cərrahiyyənin əsas istiqamətlərindən biridir.', N'Robotik Endoskopik Cərrahiyyə', N'Robotik endoskopik cərrahiyyə ən son texnologiyadır ki, cərraha daha dəqiq və təhlükəsiz əməliyyat imkanı verir. Bu texnologiya xüsusilə mürəkkəb əməliyyatlarda geniş istifadə olunur.'),
('06', N'Uşaq Sağlamlığı və Pediatriya', N'Uşaqların sağlamlığının qorunması və müalicəsində müasir yanaşmalar və preventiv tədbirlər.', N'25 Avqust 2025', 41, N'Uşaq Sağlamlığının Qorunması', N'Uşaqların sağlamlığının qorunması cəmiyyətin gələcəyi üçün vacibdir. Düzgün qidalanma, fiziki fəaliyyət və profilaktik yoxlamalar uşaq sağlamlığının əsas təməlləridir.', N'Müasir Pediatrik Müalicə', N'Müasir pediatrik müalicədə uşaqların yaş xüsusiyyətləri nəzərə alınır və onlara uyğun müalicə planları hazırlanır. Həmçinin, valideynlərlə sıx əməkdaşlıq da vacibdir.'),
('07', N'Dermatologiya və Kosmetologiya', N'Dəri xəstəliklərinin müalicəsi və kosmetik problemlərin həllində yeni üsullar və texnologiyalar.', N'23 Avqust 2025', 38, N'Dəri Xəstəliklərinin Müalicəsi', N'Dəri xəstəlikləri həm fiziki, həm də psixoloji problemlər yarada bilər. Müasir dermatologiya müalicəsində həm xəstəliyin müalicəsi, həm də estetik nəticələrə diqqət yetirilir.', N'Kosmetik Dermatologiya', N'Kosmetik dermatologiyada lazer texnologiyaları, botoks və dəri dolğuları geniş istifadə olunur. Bu üsullar dərinin gəncliyini qoruyur və estetik görünüşü yaxşılaşdırır.'),
('08', N'Ortopediya və Travmatologiya', N'Sümük-əzələ sistemi xəstəliklərinin və zədələnmələrini müalicəsində müasir cərrahiyyə üsulları.', N'21 Avqust 2025', 29, N'Ortopedik Müalicənin Əsasları', N'Sümük-əzələ sistemi xəstəlikləri insanın hərəkət etmə qabiliyyətini məhdudlaşdırır. Müasir ortopedik müalicədə həm funksional bərpa, həm də estetik nəticələrə diqqət yetirilir.', N'Müasir Ortopedik Texnologiyalar', N'Müasir ortopedik müalicədə 3D çap texnologiyası, robotik cərrahiyyə və bioloji materiallar geniş istifadə olunur. Bu texnologiyalar müalicənin effektivliyini artırır və sağalma müddətini qısaldır.');

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

PRINT 'All tables created successfully with sample data!';
