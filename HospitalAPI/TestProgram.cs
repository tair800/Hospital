using HospitalAPI;

namespace TestProgram
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Starting database test...");
            await TestDatabase.TestDatabaseConnection();
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}

