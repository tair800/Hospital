namespace HospitalAPI.Services
{
    public interface IDoctorService
    {
        // We'll add specific methods here when we decide on the doctor structure
        Task<bool> IsServiceAvailable();
    }
}
