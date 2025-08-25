namespace HospitalAPI.Services
{
    public class PatientService : IPatientService
    {
        public async Task<bool> IsServiceAvailable()
        {
            // Placeholder implementation - we'll add real logic later
            return await Task.FromResult(true);
        }
    }
}
