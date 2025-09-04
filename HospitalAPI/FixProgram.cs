using HospitalAPI;

namespace FixProgram
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Starting employee data fix...");
            await FixEmployeeData.FixEmployeeIds();
            Console.WriteLine("Fix completed! Press any key to exit...");
            Console.ReadKey();
        }
    }
}
