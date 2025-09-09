using Microsoft.EntityFrameworkCore;
using HospitalAPI.Data;
using HospitalAPI.Models;

namespace HospitalAPI
{
    public static class SeedEventData
    {
        public static async Task SeedAsync(HospitalDbContext context)
        {
            // Clear existing data for all events to allow re-seeding
            var existingSpeakers = await context.EventSpeakers.ToListAsync();
            var existingTimeline = await context.EventTimeline.ToListAsync();
            var existingEventEmployees = await context.EventEmployees.ToListAsync();
            
            context.EventSpeakers.RemoveRange(existingSpeakers);
            context.EventTimeline.RemoveRange(existingTimeline);
            context.EventEmployees.RemoveRange(existingEventEmployees);
            await context.SaveChangesAsync();

            // Get all events
            var events = await context.Events.ToListAsync();
            if (!events.Any())
            {
                return; // No events exist
            }

            // Seed data for all events
            var allSpeakers = new List<EventSpeaker>();
            var allTimeline = new List<EventTimeline>();
            var allEventEmployees = new List<EventEmployee>();

            // Get all employees for assignment
            var allEmployees = await context.Employees.ToListAsync();

            foreach (var eventItem in events)
            {
                // Add speakers for each event (2-4 speakers per event)
                var speakerCount = (eventItem.Id % 3) + 2; // 2-4 speakers
                for (int i = 0; i < speakerCount; i++)
                {
                    allSpeakers.Add(new EventSpeaker
                    {
                        EventId = eventItem.Id,
                        Name = GetSpeakerName(eventItem.Id, i),
                        Title = GetSpeakerTitle(eventItem.Id, i),
                        Image = $"/src/assets/speaker{eventItem.Id}{i + 1}.png"
                    });
                }

                // Add timeline for each event (3-6 slots per event)
                var timelineCount = (eventItem.Id % 4) + 3; // 3-6 timeline slots
                for (int i = 0; i < timelineCount; i++)
                {
                    allTimeline.Add(new EventTimeline
                    {
                        EventId = eventItem.Id,
                        StartTime = GetStartTime(eventItem.Id, i),
                        EndTime = GetEndTime(eventItem.Id, i),
                        Title = GetTimelineTitle(eventItem.Id, i),
                        Description = GetTimelineDescription(eventItem.Id, i),
                        Info = GetTimelineInfo(eventItem.Id, i),
                        OrderIndex = i + 1
                    });
                }

                // Add employees for each event (1-3 employees per event)
                var employeeCount = Math.Min((eventItem.Id % 3) + 1, allEmployees.Count);
                for (int i = 0; i < employeeCount; i++)
                {
                    var employeeIndex = (eventItem.Id + i) % allEmployees.Count;
                    allEventEmployees.Add(new EventEmployee
                    {
                        EventId = eventItem.Id,
                        EmployeeId = allEmployees[employeeIndex].Id
                    });
                }
            }

            context.EventSpeakers.AddRange(allSpeakers);
            context.EventTimeline.AddRange(allTimeline);
            context.EventEmployees.AddRange(allEventEmployees);

            await context.SaveChangesAsync();
        }

        private static string GetSpeakerName(int eventId, int index)
        {
            var names = new Dictionary<int, string[]>
            {
                { 4, new[] { "Dr. Niyazi Bayramov", "Dr. İlkin İsmayılov", "MD. Dr. Eldar Əhmədov", "Prof. Dr. Leyla Əliyeva" } },
                { 5, new[] { "Dr. Ali Veliyev", "Prof. Dr. Rəşad Həsənov", "Dr. Günel Məmmədova" } },
                { 6, new[] { "Dr. Leyla Məmmədova", "Prof. Dr. Aynur Quliyeva", "Dr. Mehdi Həsənov" } },
                { 7, new[] { "Nurlan Mammadov", "Dr. Aysu Əliyeva", "Prof. Dr. Elşən Rəhimov" } },
                { 8, new[] { "Prof. Dr. Aynur Əliyeva", "Dr. Vüsal Əliyev", "Dr. Rəşad Hüseynov", "Dr. Günel Məmmədova" } },
                { 9, new[] { "Dr. Rəşad Hüseynov", "Prof. Dr. Elşən Rəhimov", "Dr. Aysu Hüseynova" } },
                { 10, new[] { "Dr. Vüsal Əliyev", "Prof. Dr. Günel Məmmədova", "Dr. Rəşad Həsənov" } },
                { 11, new[] { "Dr. Elşən Rəhimov", "Dr. Aysu Hüseynova", "Prof. Dr. Leyla Əliyeva" } },
                { 12, new[] { "Dr. Günel Məmmədli", "Prof. Dr. Rəşad Həsənov", "Dr. Mehdi Həsənov", "Dr. Aynur Quliyeva" } },
                { 13, new[] { "Dr. Aysu Hüseynova", "Prof. Dr. Vüsal Əliyev", "Dr. Rəşad Məmmədov" } },
                { 15, new[] { "Dr. Test Speaker", "Prof. Dr. Test Expert" } }
            };

            var eventNames = names.ContainsKey(eventId) ? names[eventId] : new[] { $"Dr. Speaker {index + 1}" };
            return eventNames[index % eventNames.Length];
        }

        private static string GetSpeakerTitle(int eventId, int index)
        {
            var titles = new Dictionary<int, string[]>
            {
                { 4, new[] { "Gəncə Şəhər İcra Hakimi", "Gəncə Birləşmiş Şəhər Xəstəxanası Direktoru", "AHPBCA Sədri", "Tibbi Texnologiya Eksperti" } },
                { 5, new[] { "Kardioloq", "Ürək Cərrahı", "Kardioloji Ekspert" } },
                { 6, new[] { "Kardioloq", "Ürək Sağlamlığı Eksperti", "Kardioloji Mütəxəssis" } },
                { 7, new[] { "Pediatr", "Uşaq Həkimi", "Pediatrik Ekspert" } },
                { 8, new[] { "İmmunoloq", "Uşaq İmmunoloqu", "Pediatrik İmmunoloq", "İmmun Sistem Eksperti" } },
                { 9, new[] { "Neuroloq", "Beyin Cərrahı", "Neuroloji Ekspert" } },
                { 10, new[] { "Onkoloq", "Xərçəng Eksperti", "Onkoloji Cərrah" } },
                { 11, new[] { "Təcili Yardım Həkimi", "Təcili Tibbi Ekspert", "Təcili Yardım Mütəxəssisi" } },
                { 12, new[] { "Radioloq", "Radiodiaqnostika Eksperti", "Radioloji Mütəxəssis", "Radiasiya Təhlükəsizliyi Eksperti" } },
                { 13, new[] { "Laboratoriya Həkimi", "Kliniki Laboratoriya Eksperti", "Laboratoriya Mütəxəssisi" } },
                { 15, new[] { "Test Ekspert", "Test Mütəxəssis" } }
            };

            var eventTitles = titles.ContainsKey(eventId) ? titles[eventId] : new[] { $"Ekspert {index + 1}" };
            return eventTitles[index % eventTitles.Length];
        }

        private static string GetStartTime(int eventId, int index)
        {
            var baseTimes = new Dictionary<int, string[]>
            {
                { 4, new[] { "09:00", "09:30", "10:15", "10:43", "11:15", "12:00" } },
                { 5, new[] { "10:00", "10:30", "11:00" } },
                { 6, new[] { "15:00", "15:30", "16:00" } },
                { 7, new[] { "16:00", "16:30", "17:00", "17:30" } },
                { 8, new[] { "09:00", "09:30", "10:00", "10:30", "11:00" } },
                { 9, new[] { "13:00", "13:30", "14:00" } },
                { 10, new[] { "11:00", "11:30", "12:00", "12:30" } },
                { 11, new[] { "14:00", "14:30", "15:00" } },
                { 12, new[] { "10:00", "10:30", "11:00", "11:30", "12:00" } },
                { 13, new[] { "20:00", "20:30", "21:00" } },
                { 15, new[] { "00:33", "01:00" } }
            };

            var eventTimes = baseTimes.ContainsKey(eventId) ? baseTimes[eventId] : new[] { "09:00", "09:30", "10:00" };
            return eventTimes[index % eventTimes.Length];
        }

        private static string GetEndTime(int eventId, int index)
        {
            var startTime = GetStartTime(eventId, index);
            var time = TimeSpan.Parse(startTime);
            var endTime = time.Add(TimeSpan.FromMinutes(30 + (index * 15)));
            return endTime.ToString(@"hh\:mm");
        }

        private static string GetTimelineTitle(int eventId, int index)
        {
            var titles = new Dictionary<int, string[]>
            {
                { 4, new[] { "Açılış və Qeydiyyat", "Tibbi Texnologiyaların Gələcəyi", "Kardioloji Yeniliklər", "Qəhvə Fasiləsi", "Onkologiya Sahəsində İnnovasiyalar", "Sual-Cavab Sessiyası" } },
                { 5, new[] { "Kardioloji Təcili Yardım", "Müasir Kardioloji Texnologiyalar", "Praktiki Təcrübələr" } },
                { 6, new[] { "Ürək Sağlamlığı", "Qorunma Üsulları", "Erkən Diaqnostika" } },
                { 7, new[] { "Uşaq Diaqnostikası", "Müasir Müalicə Üsulları", "Xəstə Qayğısı", "Təcrübə Paylaşımı" } },
                { 8, new[] { "İmmun Sistem Xəstəlikləri", "Autoimmün Xəstəliklər", "Allergiyalar", "Müasir Müalicə", "Təcrübə Paylaşımı" } },
                { 9, new[] { "Neuroloji Xəstəliklər", "Beyin Cərrahiyyəsi", "Müasir Müalicə" } },
                { 10, new[] { "Xərçəng Diaqnostikası", "Müasir Müalicə Üsulları", "Qorunma Strategiyaları", "Təcrübə Paylaşımı" } },
                { 11, new[] { "İlk Yardım", "Təcili Hallar", "Xəstə Qayğısı" } },
                { 12, new[] { "Radiodiaqnostika", "Radiasiya Təhlükəsizliyi", "Müasir Texnologiyalar", "Təhlükəsizlik Protokolları", "Təcrübə Paylaşımı" } },
                { 13, new[] { "Laboratoriya Texnologiyaları", "Kliniki Diaqnostika", "Keyfiyyət İdarəetməsi" } },
                { 15, new[] { "Test Sessiyası", "Test Müzakirəsi" } }
            };

            var eventTitles = titles.ContainsKey(eventId) ? titles[eventId] : new[] { $"Sessiya {index + 1}" };
            return eventTitles[index % eventTitles.Length];
        }

        private static string GetTimelineDescription(int eventId, int index)
        {
            var descriptions = new Dictionary<int, string[]>
            {
                { 4, new[] { "Konfransın açılış mərasimi və iştirakçıların qeydiyyatı.", "Müasir tibbi texnologiyaların inkişafı və gələcək perspektivləri.", "Ürək-damar xəstəliklərinin müalicəsində son yeniliklər.", "İştirakçılar üçün qəhvə fasiləsi və networking imkanları.", "Xərçəng müalicəsində yeni üsullar və texnologiyalar.", "Bütün iştirakçılar üçün açıq sual-cavab sessiyası." } },
                { 5, new[] { "Kardioloji təcili yardım təcrübələri və müasir müalicə üsulları.", "Müasir kardioloji texnologiyalar və cərrahi üsullar.", "Praktiki təcrübələr və real halların müzakirəsi." } },
                { 6, new[] { "Ürək sağlamlığının qorunması və həyat tərzi dəyişiklikləri.", "Ürək xəstəliklərindən qorunma üsulları və risk amilləri.", "Ürək xəstəliklərinin erkən diaqnostikası və müalicəsi." } },
                { 7, new[] { "Uşaq xəstəliklərinin müasir diaqnostika üsulları.", "Pediatrik müalicə protokolları və xəstə qayğısı.", "Uşaqların inkişaf mərhələləri və normal halların fərqləndirilməsi.", "Müasir diaqnostika cihazlarından istifadə üsulları." } },
                { 8, new[] { "Uşaqlarda immun sistem xəstəliklərinin diaqnostikası.", "Autoimmün xəstəliklər və immun yetərinsizlik sindromları.", "Allergiyalar və immun sistemin müasir müalicəsi.", "Pediatrik immunologiya sahəsində müasir yanaşmalar.", "Beynəlxalq təcrübələrin müzakirəsi." } },
                { 9, new[] { "Beyin və sinir sistemi xəstəliklərinin müasir müalicəsi.", "Beyin cərrahiyyəsi və stereotaktik radioşirurgiya.", "Müasir neuroloji müalicə üsulları və təcrübələr." } },
                { 10, new[] { "Xərçəng xəstəliyinin erkən diaqnostikası və risk amilləri.", "Müasir xərçəng müalicə yanaşmaları və protokolları.", "Qorunma strategiyaları və həyat tərzi dəyişiklikləri.", "Ximioterapiya, radioterapiya və immunoterapiya üsulları." } },
                { 11, new[] { "Təcili hallarda ilk yardım göstərilməsi və xəstə qayğısı.", "Təcili tibbi yardım xidmətlərinin təşkili və idarəetməsi.", "Praktiki təlim və real halların simulyasiyası." } },
                { 12, new[] { "Müasir radiodiaqnostika üsulları və texnologiyalar.", "Radiasiya təhlükəsizliyi və xəstə qorunması.", "Kompüter tomografiyası və maqnit-rezonans texnologiyaları.", "Radiodiaqnostika cihazlarından düzgün istifadə üsulları.", "Təhlükəsizlik protokolları və standartlar." } },
                { 13, new[] { "Kliniki laboratoriya texnologiyaları və avtomatlaşdırma.", "Biokimyəvi testlər və mikrobiologiya üsulları.", "Keyfiyyət idarəetməsi və nəticələrin düzgün şərhi." } },
                { 15, new[] { "Test sessiyası və müzakirələr.", "Test təcrübələrinin paylaşılması." } }
            };

            var eventDescriptions = descriptions.ContainsKey(eventId) ? descriptions[eventId] : new[] { $"Sessiya {index + 1} təsviri." };
            return eventDescriptions[index % eventDescriptions.Length];
        }

        private static string GetTimelineInfo(int eventId, int index)
        {
            var infos = new Dictionary<int, string[]>
            {
                { 4, new[] { "Gəncə Şəhər İcra Hakimi: <strong>Niyazi Bayramov</strong>", "AI və maşın öyrənməsi tibbdə", "Minimal invaziv ürək əməliyyatları", "Qəhvə və çay xidməti", "Personalizasiya edilmiş müalicə", "Açıq sual-cavab sessiyası" } },
                { 5, new[] { "Kardioloji təcili yardım protokolları", "Müasir stent texnologiyaları", "Praktiki təcrübə və simulyasiya" } },
                { 6, new[] { "Həyat tərzi dəyişiklikləri", "Risk amillərinin qiymətləndirilməsi", "Erkən diaqnostika üsulları" } },
                { 7, new[] { "Pediatrik diaqnostika texnologiyaları", "Müasir müalicə protokolları", "Xəstə qayğısı standartları", "İnkişaf mərhələlərinin qiymətləndirilməsi" } },
                { 8, new[] { "İmmun yetərinsizlik sindromları", "Autoimmün xəstəliklər", "Allergiya diaqnostikası", "Müasir immunoterapiya", "Beynəlxalq standartlar" } },
                { 9, new[] { "İnslut və epilepsiya müalicəsi", "Beyin cərrahiyyəsi texnologiyaları", "Müasir neuroloji müalicə" } },
                { 10, new[] { "Xərçəng risk amilləri", "Erkən diaqnostika üsulları", "Müasir müalicə protokolları", "Qorunma strategiyaları" } },
                { 11, new[] { "İlk yardım texnikaları", "Təcili halların idarəetməsi", "Xəstə qayğısı standartları" } },
                { 12, new[] { "Radiodiaqnostika texnologiyaları", "Radiasiya təhlükəsizliyi", "Müasir cihazlar", "Təhlükəsizlik protokolları", "Standartlar və qaydalar" } },
                { 13, new[] { "Laboratoriya avtomatlaşdırması", "Keyfiyyət idarəetməsi", "Nəticələrin şərhi" } },
                { 15, new[] { "Test məlumatları", "Test müzakirələri" } }
            };

            var eventInfos = infos.ContainsKey(eventId) ? infos[eventId] : new[] { $"Sessiya {index + 1} məlumatları" };
            return eventInfos[index % eventInfos.Length];
        }
    }
}
