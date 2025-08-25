# Hospital Management System

This repository contains a complete Hospital Management System with both frontend and backend components.

## Project Structure

```
hospitalApp/
├── hospital/              # React Frontend Application
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── ...
├── HospitalAPI/          # .NET 8 Web API Backend
│   ├── Controllers/      # API Controllers
│   ├── Services/         # Business logic services
│   ├── Data/             # Database context
│   ├── HospitalAPI.csproj # Backend project file
│   └── ...
├── HospitalAPI.sln       # .NET Solution file
└── README.md             # This file
```

## Frontend (React)

The frontend is a React application built with Vite, located in the `hospital/` folder.

### Features:
- Modern React 19 with hooks
- Responsive design
- Multiple pages (Home, About, Services, Contact, etc.)
- Component-based architecture

### To run the frontend:
```bash
cd hospital
npm install
npm run dev
```

## Backend (.NET API)

The backend is a .NET 8 Web API located in the `HospitalAPI/` folder.

### Features:
- .NET 8 Web API
- Entity Framework Core
- Swagger/OpenAPI documentation
- CORS configuration
- Service layer architecture
- Ready for database integration

### To run the backend:
```bash
cd HospitalAPI
dotnet restore
dotnet build
dotnet run
```

The API will be available at:
- **API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001/swagger

## Development Workflow

1. **Start the Backend**: Run the .NET API first
2. **Start the Frontend**: Run the React app
3. **Connect**: The frontend will communicate with the backend API
4. **Database**: Configure database tables when ready

## Current Status

✅ **Frontend**: Complete React application
✅ **Backend Infrastructure**: Complete .NET API setup
⏳ **Database Schema**: To be decided
⏳ **API Integration**: To be implemented

## Next Steps

1. Decide on database schema and tables
2. Implement full CRUD operations in the API
3. Connect frontend to backend API
4. Add authentication and authorization
5. Deploy both applications

## Technologies Used

- **Frontend**: React 19, Vite, CSS3
- **Backend**: .NET 8, Entity Framework Core, SQL Server
- **Development**: Visual Studio Code, .NET CLI
