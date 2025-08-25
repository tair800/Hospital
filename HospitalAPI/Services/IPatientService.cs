namespace HospitalAPI.Services
{
    public interface IPatientService
    {
        // We'll add specific methods here when we decide on the patient structure
        Task<bool> IsServiceAvailable();
    }
}
