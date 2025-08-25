namespace HospitalAPI.Services
{
    public interface IDepartmentService
    {
        // We'll add specific methods here when we decide on the department structure
        Task<bool> IsServiceAvailable();
    }
}
