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

-- Insert sample blog data
INSERT INTO [dbo].[Blogs] ([Number], [Title], [Description], [Date], [Visitors], [SecondDescTitle], [SecondDescBody], [ThirdTextTitle], [ThirdTextBody])
VALUES 
('01', N'HPB Cərrahiyyə Hallarının Klinik Təhlili', N'Yeni texnologiyalardan istifadə edərək öd yolları sistemi xəstəliklərinin diaqnozu və müalicəsi haqqında panel və workshop-larda iştirakçılar real klinik təcrübə qazanırlar.', N'5 Sentyabr 2025', 28, N'HPB Cərrahiyyəsinin Əhəmiyyəti', N'HPB cərrahiyyəsi müasir tibb sahəsində ən çətin və mürəkkəb əməliyyatlardan biridir. Bu sahədə ixtisaslaşmış cərrahlar yüksək texniki bacarıq və geniş anatomiya biliklərinə malik olmalıdır. Qaraciyər, öd yolları və pankreas orqanlarının xəstəlikləri tez-tez həyatı təhlükə altına qoyan vəziyyətlər yaradır.', N'Müasir Texnologiyalar və Üsullar', N'Müasir HPB cərrahiyyəsində laparoskopik və robotik əməliyyat üsulları geniş istifadə olunur. Bu texnologiyalar xəstələrə daha az travmatik, daha tez sağalma və daha yaxşı nəticələr təmin edir. Həmçinin, 3D görüntüləmə və navigasiya sistemləri dəqiq diaqnostika və təhlükəsiz əməliyyat üçün vacibdir.'),
('02', N'Kardioloji Xəstəliklərin Müasir Müalicəsi', N'Ürək-damar sistemi xəstəliklərinin diaqnozu və müalicəsində ən son texnologiyaların tətbiqi haqqında məlumat verilir.', N'3 Sentyabr 2025', 45, N'Kardioloji Müalicənin Əsasları', N'Ürək-damar sistemi xəstəlikləri dünyada ən çox ölümə səbəb olan xəstəliklər sırasında birinci yerdə durur. Bu səbəbdən kardioloji sahədə müasir diaqnostika və müalicə üsullarının tətbiqi xüsusi əhəmiyyət kəsb edir.', N'İnnovativ Kardioloji Texnologiyaları', N'Müasir kardioloji müalicədə stentlərin tətbiqi, ürək kateterizasiyası və ürək cərrahiyyəsi sahəsində böyük irəliləyişlər əldə edilib. Həmçinin, telemedisina vasitəsilə məsafədən monitorinq də geniş istifadə olunur.'),
('03', N'Onkologiya Sahəsində Yeni Üsullar', N'Xərçəng xəstəliklərinin erkən diaqnozu və müalicəsində innovativ yanaşmalar və yeni dərmanlar haqqında məlumat.', N'1 Sentyabr 2025', 67, N'Onkologiya Müalicəsinin Təkamülü', N'Onkologiya sahəsində son illərdə böyük irəliləyişlər əldə edilib. Erkən diaqnoz və müasir müalicə üsulları xərçəng xəstəliklərindən sağalma şansını əhəmiyyətli dərəcədə artırır.', N'Personalizasiya Edilmiş Onkologiya', N'Müasir onkologiya müalicəsində hər xəstənin genetik xüsusiyyətlərinə uyğun personalizasiya edilmiş müalicə planları hazırlanır. Bu yanaşma müalicənin effektivliyini artırır və yan təsirləri azaldır.');
