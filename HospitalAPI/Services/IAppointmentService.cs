namespace HospitalAPI.Services
{
    public interface IAppointmentService
    {
        // We'll add specific methods here when we decide on the appointment structure
        Task<bool> IsServiceAvailable();
    }
}
