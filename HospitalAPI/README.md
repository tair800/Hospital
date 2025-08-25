# Hospital API

This is a .NET 8 Web API project for the Hospital Management System.

## Prerequisites

- .NET 8 SDK
- Visual Studio 2022 or VS Code
- SQL Server (LocalDB, SQL Server Express, or SQL Server)

## Getting Started

### 1. Restore NuGet Packages
```bash
dotnet restore
```

### 2. Build the Project
```bash
dotnet build
```

### 3. Run the API
```bash
dotnet run
```

The API will be available at:
- **API**: https://localhost:7001 (or http://localhost:5001)
- **Swagger UI**: https://localhost:7001/swagger

## Project Structure

```
HospitalAPI/
├── Controllers/          # API Controllers
├── Data/                # Database context and configurations
├── Services/            # Business logic services
├── Models/              # Data models (to be added later)
├── DTOs/                # Data Transfer Objects (to be added later)
├── Program.cs           # Application entry point
└── appsettings.json     # Configuration file
```

## Current Status

✅ **API Infrastructure**: Complete
✅ **Basic Services**: Complete (placeholder implementations)
✅ **Database Context**: Ready (no tables yet)
✅ **Swagger Documentation**: Available
✅ **CORS Configuration**: Configured
✅ **Dependency Injection**: Set up

⏳ **Database Tables**: To be decided
⏳ **Data Models**: To be created
⏳ **Full CRUD Operations**: To be implemented
⏳ **Authentication**: To be implemented

## Next Steps

1. **Decide on Database Schema**: Determine which tables and columns you need
2. **Create Entity Models**: Add data models for your entities
3. **Implement CRUD Operations**: Add full business logic to services
4. **Add Validation**: Implement input validation
5. **Add Authentication**: Implement JWT authentication
6. **Add Authorization**: Implement role-based access control

## Testing the API

Once running, you can test the API using:

- **Health Check**: `GET /api/health`
- **Ping**: `GET /api/health/ping`
- **Swagger UI**: Navigate to `/swagger` in your browser

## Configuration

Update `appsettings.json` to configure:
- Database connection string
- JWT settings
- Logging levels
- CORS policies

## Database Connection

The current connection string uses LocalDB. Update it in `appsettings.json` to point to your SQL Server instance when ready.
