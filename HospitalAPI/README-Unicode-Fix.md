# Fixing Unicode Characters for Azerbaijani Language

## Problem
Azerbaijani letters like "Ə", "ə", "Ğ", "ğ" are displaying as "?" characters in the application.

## Root Cause
This is typically caused by:
1. Database collation not supporting Azerbaijani characters
2. Connection string missing Unicode support
3. Font rendering issues in the frontend
4. Missing proper character encoding in API responses

## Solutions Applied

### 1. Database Configuration

#### Updated Connection String
```json
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=HospitalAPI;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true;Connection Timeout=30;Command Timeout=30"
```

**Note**: SQL Server automatically supports Unicode with `nvarchar` data types. No additional charset parameters are needed.

#### Database Collation
Use `SQL_Latin1_General_CP1254_CI_AS` collation for proper Turkish/Azerbaijani character support:

```sql
-- For new tables
CREATE TABLE Contacts (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Type NVARCHAR(50) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Value NVARCHAR(500) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    Icon NVARCHAR(100) COLLATE SQL_Latin1_General_CP1254_CI_AS NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- For existing database (if you have permission)
ALTER DATABASE HospitalAPI COLLATE SQL_Latin1_General_CP1254_CI_AS;
```

### 2. API Configuration

#### Entity Framework Configuration
The `HospitalDbContext` already uses `nvarchar` which supports Unicode:

```csharp
modelBuilder.Entity<Contact>(entity =>
{
    entity.HasKey(c => c.Id);
    entity.Property(c => c.Type).IsRequired().HasMaxLength(50).HasColumnType("nvarchar(50)");
    entity.Property(c => c.Value).IsRequired().HasMaxLength(500).HasColumnType("nvarchar(500)");
    entity.Property(c => c.Icon).IsRequired().HasMaxLength(100).HasColumnType("nvarchar(100)");
    entity.Property(c => c.CreatedAt).HasDefaultValueSql("GETDATE()");
    entity.Property(c => c.UpdatedAt).HasDefaultValueSql("GETDATE()");
});
```

### 3. Frontend Configuration

#### CSS Font Support
Added proper font families that support Azerbaijani characters:

```css
.contact-page {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.form-input {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-feature-settings: 'liga' 1, 'kern' 1;
}
```

#### React Component Font
Added inline font styling for form inputs:

```jsx
<input
    style={{ fontFamily: 'Arial, sans-serif' }}
    // ... other props
/>
```

### 4. SQL Scripts

#### Unicode-Safe Data Insertion
Use `N` prefix for Unicode strings:

```sql
INSERT INTO Contacts (Type, Value, Icon) VALUES
('location', N'Bakı, Azərbaycan', 'location-icon.png');
```

## Testing the Fix

### 1. Database Level
```sql
-- Test if Azerbaijani characters display correctly
SELECT Type, Value FROM Contacts WHERE Type = 'location';
-- Should show: "Bakı, Azərbaycan" not "Bak?, Az?rbaycan"
```

### 2. API Level
```bash
# Test API response
curl http://localhost:5000/api/Contact
# Check if response contains proper Unicode characters
```

### 3. Frontend Level
- Open Contact page in browser
- Check if "Bakı, Azərbaycan" displays correctly
- Test form inputs with Azerbaijani characters

## Additional Recommendations

### 1. Database Collation
If possible, set the entire database to use Azerbaijani collation:

```sql
ALTER DATABASE HospitalAPI COLLATE Azerbaijani_100_CI_AS;
```

### 2. API Response Headers
Ensure API returns proper content type:

```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
{
    Response.Headers.Add("Content-Type", "application/json; charset=utf-8");
    return await _context.Contacts.ToListAsync();
}
```

### 3. Frontend Meta Tags
Add proper meta tags in HTML:

```html
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
```

### 4. Font Loading
Consider loading fonts that specifically support Azerbaijani:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');

.contact-page {
    font-family: 'Noto Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

## Troubleshooting

### If Characters Still Don't Display:

1. **Check Database Collation**:
   ```sql
   SELECT DATABASEPROPERTYEX('HospitalAPI', 'Collation');
   ```

2. **Verify Connection String**:
   - SQL Server automatically supports Unicode with `nvarchar`
   - No charset parameters needed in connection string
   - Check if SQL Server supports the collation

3. **Test Font Support**:
   - Try different fonts in CSS
   - Check browser developer tools for font loading

4. **API Response**:
   - Check response headers for charset
   - Verify JSON encoding in browser Network tab

## Files Modified

1. `HospitalAPI/appsettings.json` - Added CharSet=utf8
2. `HospitalAPI/Database/CreateContactsTable.sql` - Added collation
3. `HospitalAPI/Database/CreateContactsTableUnicode.sql` - New Unicode script
4. `hospital/src/pages/admin/AdminContact.css` - Added font support
5. `hospital/src/components/Contact.css` - Added font support
6. `hospital/src/pages/admin/AdminContact.jsx` - Added font styling

## Expected Result

After applying these fixes:
- ✅ "Ə" should display as "Ə" not "?"
- ✅ "ə" should display as "ə" not "?"
- ✅ "Bakı, Azərbaycan" should display correctly
- ✅ Form inputs should properly handle Azerbaijani characters
- ✅ API responses should maintain Unicode integrity
