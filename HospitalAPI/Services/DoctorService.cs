namespace HospitalAPI.Services
{
    public class DoctorService : IDoctorService
    {
        public async Task<bool> IsServiceAvailable()
        {
            // Placeholder implementation - we'll add real logic later
            return await Task.FromResult(true);
        }
    }
}
