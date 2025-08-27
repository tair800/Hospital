# Contacts API Documentation

## Overview
The Contacts API provides CRUD operations for managing contact information including phone, email, location, and social media platforms.

## Model Structure
```csharp
public class Contact
{
    public int Id { get; set; }
    public string Type { get; set; }        // e.g., 'phone', 'email', 'facebook'
    public string Value { get; set; }       // e.g., phone number, email, URL
    public string Icon { get; set; }        // icon filename
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

## API Endpoints

### GET /api/Contact
- **Description**: Get all contacts
- **Response**: List of all contact entries
- **Example**: `GET /api/Contact`

### GET /api/Contact/{id}
- **Description**: Get contact by ID
- **Parameters**: `id` (int) - Contact ID
- **Response**: Single contact object
- **Example**: `GET /api/Contact/1`

### GET /api/Contact/type/{type}
- **Description**: Get contact by type (e.g., 'phone', 'email', 'facebook')
- **Parameters**: `type` (string) - Contact type
- **Response**: Single contact object
- **Example**: `GET /api/Contact/type/phone`

### POST /api/Contact
- **Description**: Create new contact
- **Body**: Contact object (Type, Value, Icon required)
- **Response**: Created contact with ID
- **Example**:
```json
{
    "type": "phone",
    "value": "+(994) 50 123 45 67",
    "icon": "phone-icon.png"
}
```

### PUT /api/Contact/{id}
- **Description**: Update existing contact
- **Parameters**: `id` (int) - Contact ID
- **Body**: Updated contact object
- **Response**: 204 No Content on success
- **Example**: `PUT /api/Contact/1`

### DELETE /api/Contact/{id}
- **Description**: Delete contact
- **Parameters**: `id` (int) - Contact ID
- **Response**: 204 No Content on success
- **Example**: `DELETE /api/Contact/1`

## Sample Data
The database comes pre-populated with sample contact data:

| Type | Value | Icon |
|------|-------|------|
| phone | +(994) 50 xxx xx xx | phone-icon.png |
| whatsapp | +(994) 50 xxx xx xx | whatsapp-icon.png |
| email | example@gmail.com | mail-icon.png |
| location | Bakı, Azərbaycan | location-icon.png |
| facebook | https://facebook.com/hospital | facebook.png |
| instagram | https://instagram.com/hospital | instagram.png |
| linkedin | https://linkedin.com/company/hospital | linkedin.png |
| youtube | https://youtube.com/hospital | youtube.png |
| telegram | https://t.me/hospital | telegram.png |

## Database Schema
```sql
CREATE TABLE Contacts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Type NVARCHAR(50) NOT NULL,
    Value NVARCHAR(500) NOT NULL,
    Icon NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
```

## Usage Examples

### Get all contacts
```javascript
fetch('/api/Contact')
    .then(response => response.json())
    .then(contacts => console.log(contacts));
```

### Get contact by type
```javascript
fetch('/api/Contact/type/phone')
    .then(response => response.json())
    .then(contact => console.log(contact));
```

### Create new contact
```javascript
fetch('/api/Contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        type: 'phone',
        value: '+(994) 50 123 45 67',
        icon: 'phone-icon.png'
    })
});
```

### Update contact
```javascript
fetch('/api/Contact/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id: 1,
        type: 'phone',
        value: '+(994) 50 987 65 43',
        icon: 'phone-icon.png'
    })
});
```

### Delete contact
```javascript
fetch('/api/Contact/1', {
    method: 'DELETE'
});
```

## Notes
- All timestamps are automatically managed (CreatedAt, UpdatedAt)
- Type field is case-insensitive for lookups
- Icon field should contain the filename of the icon image
- Value field can contain phone numbers, emails, URLs, or any contact information
