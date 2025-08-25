using Microsoft.AspNetCore.Mvc;
using HospitalAPI.Services;

namespace HospitalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IDoctorService _doctorService;
        private readonly IAppointmentService _appointmentService;
        private readonly IDepartmentService _departmentService;

        public HealthController(
            IPatientService patientService,
            IDoctorService doctorService,
            IAppointmentService appointmentService,
            IDepartmentService departmentService)
        {
            _patientService = patientService;
            _doctorService = doctorService;
            _appointmentService = appointmentService;
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealth()
        {
            var healthStatus = new
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Services = new
                {
                    PatientService = await _patientService.IsServiceAvailable(),
                    DoctorService = await _doctorService.IsServiceAvailable(),
                    AppointmentService = await _appointmentService.IsServiceAvailable(),
                    DepartmentService = await _departmentService.IsServiceAvailable()
                },
                Message = "Hospital API is running successfully. Database tables will be configured later."
            };

            return Ok(healthStatus);
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new { Message = "Pong!", Timestamp = DateTime.UtcNow });
        }
    }
}
