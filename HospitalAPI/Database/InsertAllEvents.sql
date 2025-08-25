-- Insert All Events with proper Unicode support for Azerbaijani text
-- Run this script in SQL Server Management Studio or Azure Data Studio
-- Make sure you're connected to HospitalAPI database

USE [HospitalAPI]
GO

-- Clear existing data first
DELETE FROM [dbo].[Events]
GO

-- Insert all events with proper Azerbaijani text (using N prefix for Unicode)
INSERT INTO [dbo].[Events] ([Title], [Subtitle], [Description], [LongDescription], [EventDate], [Time], [Venue], [Trainer], [IsFree], [Price], [Currency], [MainImage], [DetailImageLeft], [DetailImageMain], [DetailImageRight], [IsMain]) VALUES

-- Main Featured Event
(N'HPB Cərrahiyyə Hallarının Klinik Təhlili', N'Müasir Diaqnostika və Müalicə Yanaşmaları', N'Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir.', N'Qaraciyər, öd yolları və pankreas xəstəliklərinin diaqnostika və müalicəsində ən son yenilikləri bir araya gətirən nüfuzlu elmi tədbirdir. Forumun əsas məqsədi bu sahədə çalışan həkimlər, cərrahlar, radioloqlar, gastroenteroloqlar, onkoloqlar və tədqiqatçıların bilik və təcrübə mübadiləsini təmin etməkdir. Tədbirdə müasir diaqnostika üsulları, endoskopik texnologiyalar, robotik cərrahiyyə və minimal invaziv müalicə yanaşmaları haqqında geniş məlumat veriləcək.', '2025-09-15T14:00:00', '14:00', N'Baku Crystal Hall', N'Yusif Qasımov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 1),

-- Cardiology Events
(N'Kardioloji Təcili Yardım Təcrübələri', N'Müasir Kardioloji Təcili Yardım Metodları', N'Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları haqqında geniş məlumat.', N'Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları haqqında geniş məlumat. Tədbirdə ürək xəstəliklərinin təcili diaqnostikası, müalicəsi və xəstə qayğısı haqqında məlumat veriləcək. Ürək tutması, aritmiya, ürək çatışmazlığı və digər kardioloji təcili halların müalicəsi haqqında praktiki məlumatlar paylaşılacaq.', '2025-09-25T10:00:00', '10:00', N'Medical Center Baku', N'Ali Veliyev', 0, 150.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

(N'Ürək Sağlamlığı Seminarı', N'Ürək Xəstəliklərindən Qorunma və Erkən Diaqnostika', N'Ürək sağlamlığının qorunması və ürək xəstəliklərinin erkən diaqnostikası haqqında məlumat.', N'Ürək sağlamlığının qorunması və ürək xəstəliklərinin erkən diaqnostikası haqqında məlumat. Tədbirdə ürək sağlamlığını qorumaq üçün həyat tərzi dəyişiklikləri, düzgün qidalanma, fiziki fəaliyyət və stress idarəetməsi haqqında geniş məlumat veriləcək. Həmçinin ürək xəstəliklərinin erkən əlamətləri və risk amilləri haqqında da məlumat veriləcək.', '2025-10-05T15:00:00', '15:00', N'Cardiology Institute', N'Dr. Leyla Məmmədova', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

-- Pediatric Events
(N'Pediatriya Xəstəliklərinin Diaqnozu', N'Uşaq Sağlamlığında Müasir Diaqnostika', N'Uşaq xəstəliklərinin müasir diaqnostika üsulları və müalicə yanaşmaları haqqında məlumat.', N'Uşaq xəstəliklərinin müasir diaqnostika üsulları və müalicə yanaşmaları haqqında məlumat. Tədbirdə pediatrik diaqnostika texnologiyaları, müasir müalicə protokolları və xəstə qayğısı haqqında geniş məlumat veriləcək. Uşaqların inkişaf mərhələləri, normal və patoloji halların fərqləndirilməsi, müasir diaqnostika cihazlarından istifadə üsulları haqqında da məlumat veriləcək.', '2025-10-08T16:00:00', '16:00', N'Children''s Hospital', N'Nurlan Mammadov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

(N'Uşaq İmmunologiyası Konfransı', N'Uşaqlarda İmmun Sistem Xəstəlikləri və Müalicəsi', N'Uşaqlarda immun sistem xəstəliklərinin diaqnostikası və müalicəsi haqqında elmi konfrans.', N'Uşaqlarda immun sistem xəstəliklərinin diaqnostikası və müalicəsi haqqında elmi konfrans. Tədbirdə immun yetərinsizlik sindromları, autoimmün xəstəliklər, allergiyalar və immun sistemin müasir müalicə üsulları haqqında geniş məlumat veriləcək. Beynəlxalq ekspertlər tərəfindən təqdim ediləcək bu məlumatlar pediatrik immunologiya sahəsində çalışan həkimlər üçün çox faydalı olacaq.', '2025-10-20T09:00:00', '09:00', N'Pediatric Research Center', N'Prof. Dr. Aynur Əliyeva', 0, 200.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

-- Neurology Events
(N'Neurologiya Təcrübələri', N'Beyin və Sinir Sistemi Xəstəliklərinin Müasir Müalicəsi', N'Beyin və sinir sistemi xəstəliklərinin müasir müalicə üsulları haqqında təcrübə paylaşımı.', N'Beyin və sinir sistemi xəstəliklərinin müasir müalicə üsulları haqqında təcrübə paylaşımı. Tədbirdə insult, epilepsiya, Parkinson xəstəliyi, multipl skleroz və digər neuroloji xəstəliklərin müasir müalicə yanaşmaları haqqında geniş məlumat veriləcək. Həmçinin beyin cərrahiyyəsi, stereotaktik radioşirurgiya və digər müasir müalicə üsulları haqqında da məlumat veriləcək.', '2025-10-12T13:00:00', '13:00', N'Neurology Clinic', N'Dr. Rəşad Hüseynov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

-- Oncology Events
(N'Onkologiya Forumu', N'Xərçəng Xəstəliyinin Erkən Diaqnostikası və Müalicəsi', N'Xərçəng xəstəliyinin erkən diaqnostikası və müasir müalicə üsulları haqqında elmi forum.', N'Xərçəng xəstəliyinin erkən diaqnostikası və müasir müalicə üsulları haqqında elmi forum. Tədbirdə müxtəlif növ xərçənglərin erkən diaqnostikası, risk amilləri, qorunma üsulları və müasir müalicə yanaşmaları haqqında geniş məlumat veriləcək. Ximioterapiya, radioterapiya, immunoterapiya və hədəfli müalicə üsulları haqqında da məlumat veriləcək.', '2025-10-30T11:00:00', '11:00', N'Oncology Center', N'Dr. Vüsal Əliyev', 0, 180.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

-- Emergency Medicine Events
(N'Təcili Tibbi Yardım Təlimi', N'Təcili Hallarda İlk Yardım və Xəstə Qayğısı', N'Təcili hallarda ilk yardım və xəstə qayğısı haqqında praktiki təlim.', N'Təcili hallarda ilk yardım və xəstə qayğısı haqqında praktiki təlim. Tədbirdə ürək tutması, insult, travma, yanıq və digər təcili hallarda ilk yardım göstərilməsi, xəstənin təhlükəsiz şəkildə xəstəxanaya çatdırılması və təcili tibbi yardım xidmətlərinin təşkili haqqında geniş məlumat veriləcək. Təlim nəzəri və praktiki hissələrdən ibarət olacaq.', '2025-11-05T14:00:00', '14:00', N'Emergency Training Center', N'Dr. Elşən Rəhimov', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

-- Radiology Events
(N'Radioloji Diaqnostika Seminarı', N'Müasir Radiodiaqnostika Üsulları və Təhlükəsizlik', N'Müasir radiodiaqnostika üsulları və radiasiya təhlükəsizliyi haqqında seminar.', N'Müasir radiodiaqnostika üsulları və radiasiya təhlükəsizliyi haqqında seminar. Tədbirdə kompüter tomografiyası, maqnit-rezonans tomografiyası, ultrabənövşəyi şüalanma, nüvə tibbi diaqnostika və digər müasir radiodiaqnostika üsulları haqqında geniş məlumat veriləcək. Həmçinin radiasiya təhlükəsizliyi, xəstə qorunması və radiodiaqnostika cihazlarından düzgün istifadə üsulları haqqında da məlumat veriləcək.', '2025-11-15T10:00:00', '10:00', N'Radiology Department', N'Dr. Günel Məmmədli', 0, 120.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0),

-- Laboratory Medicine Events
(N'Laboratoriya Tibbiyyatı Konfransı', N'Kliniki Laboratoriya Diaqnostikasında Yeniliklər', N'Kliniki laboratoriya diaqnostikasında müasir yeniliklər və texnologiyalar haqqında konfrans.', N'Kliniki laboratoriya diaqnostikasında müasir yeniliklər və texnologiyalar haqqında konfrans. Tədbirdə qan analizləri, biokimyəvi testlər, mikrobiologiya, immunologiya və genetik diaqnostika sahələrində müasir texnologiyalar haqqında geniş məlumat veriləcək. Həmçinin laboratoriya avtomatlaşdırması, keyfiyyət idarəetməsi və nəticələrin düzgün şərh edilməsi haqqında da məlumat veriləcək.', '2025-11-25T16:00:00', '16:00', N'Laboratory Medicine Center', N'Dr. Aysu Hüseynova', 1, 0.00, 'AZN', '/src/assets/event-img.png', '/src/assets/events-detail-left.png', '/src/assets/events-detail-main.png', '/src/assets/events-detail-right.png', 0)

GO

-- Verify all events were inserted correctly
SELECT 'All Events Inserted Successfully!' as Status
SELECT COUNT(*) as TotalEvents FROM [dbo].[Events]

-- Show all events with key fields
SELECT 
    Id,
    Title,
    Subtitle,
    Trainer,
    Venue,
    EventDate,
    IsMain,
    IsFree,
    Price
FROM [dbo].[Events]
ORDER BY EventDate

-- Show events with full Azerbaijani text to verify Unicode support
SELECT 
    Id,
    Title,
    Subtitle,
    Description
FROM [dbo].[Events]
WHERE Id IN (1, 2, 3)
ORDER BY Id
GO
