# Contact Component API Integration

## Overview
The Contact component has been updated to fetch data from the new Contacts API instead of using static data. It includes fallback data in case the API is unavailable.

## API Integration

### Endpoint
- **URL**: `http://localhost:5000/api/Contact`
- **Method**: GET
- **Response**: Array of contact objects

### Data Structure
Each contact object has:
```json
{
    "id": 1,
    "type": "phone",
    "value": "+(994) 50 xxx xx xx",
    "icon": "phone-icon.png",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Contact Types
- **Contact Info**: `phone`, `whatsapp`, `email`, `location`
- **Social Media**: `facebook`, `instagram`, `linkedin`, `youtube`, `telegram`

## Component Features

### 1. **API Data Fetching**
- Automatically fetches contact data on component mount
- Separates contact info from social media based on type
- Handles API errors gracefully

### 2. **Fallback Data**
- Includes static fallback data if API fails
- Ensures component always displays content
- Logs when fallback data is used

### 3. **Loading States**
- Shows loading message while fetching data
- Indicates whether fetching from API or using fallback
- Smooth user experience

### 4. **Error Handling**
- Catches API errors and network issues
- Automatically switches to fallback data
- Logs errors for debugging

## Configuration

### API Base URL
```javascript
const API_BASE_URL = 'http://localhost:5000';
```
Change this constant to point to your API server.

### Fallback Data
```javascript
const fallbackContactData = {
    contactInfo: [...],
    socialMedia: [...]
};
```
Update this object if you need different fallback data.

## Usage

### 1. **Start the API Server**
```bash
cd HospitalAPI
dotnet run
```

### 2. **Ensure Database is Set Up**
Run the SQL script:
```sql
-- Use CreateContactsTable.sql or CreateAllTablesWithContacts.sql
```

### 3. **Start the React App**
```bash
cd hospital
npm start
```

## Troubleshooting

### Common Issues

#### 1. **API Connection Failed**
- Check if the API server is running
- Verify the API_BASE_URL is correct
- Check browser console for CORS errors

#### 2. **No Data Displayed**
- Check API response in browser Network tab
- Verify database has contact data
- Check console logs for filtering issues

#### 3. **Icons Not Loading**
- Ensure icon files exist in assets folder
- Check icon filenames match database values
- Verify getIcon and getSocialIcon functions

### Debug Information
The component logs detailed information:
- API fetch attempts
- Data filtering results
- Fallback data usage
- Rendering details

## API Endpoints Used

- `GET /api/Contact` - Fetch all contacts
- `GET /api/Contact/type/{type}` - Fetch contact by type
- `GET /api/Contact/{id}` - Fetch contact by ID

## Data Flow

1. **Component Mount** → Fetch from API
2. **API Success** → Filter and display data
3. **API Failure** → Use fallback data
4. **Render** → Display contact info and social media

## Future Enhancements

- Add retry mechanism for failed API calls
- Implement caching for better performance
- Add real-time updates
- Support for multiple API endpoints
- Enhanced error messages for users
