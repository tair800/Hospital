# Gallery Implementation

## Overview
The Gallery component has been updated to fetch images from a database instead of using hardcoded data. This provides dynamic content management and better scalability.

## Database Changes

### 1. Gallery Table
- **File**: `HospitalAPI/Database/CreateGalleryTable.sql`
- **Table**: `Gallery`
- **Columns**:
  - `Id` (INT, Primary Key, Identity)
  - `Title` (NVARCHAR(200), Required)
  - `Description` (NVARCHAR(500), Optional)
  - `Image` (NVARCHAR(500), Required) - Stores image filename
  - `OrderIndex` (INT, Default: 0) - For custom ordering
  - `IsActive` (BIT, Default: 1) - To show/hide images
  - `CreatedAt` (DATETIME2, Default: GETUTCDATE())
  - `UpdatedAt` (DATETIME2, Default: GETUTCDATE())

### 2. Sample Data
The SQL script includes 10 sample gallery images with descriptive titles and descriptions.

## Backend Changes

### 1. Gallery Model
- **File**: `HospitalAPI/Models/Gallery.cs`
- **Features**: Full model with validation attributes and table mapping

### 2. Database Context
- **File**: `HospitalAPI/Data/HospitalDbContext.cs`
- **Changes**: Added `DbSet<Gallery> Gallery` and model configuration

### 3. Gallery Controller
- **File**: `HospitalAPI/Controllers/GalleryController.cs`
- **Endpoints**:
  - `GET /api/gallery` - Get all active gallery images (ordered by OrderIndex)
  - `GET /api/gallery/{id}` - Get specific gallery item
  - `POST /api/gallery` - Create new gallery item
  - `PUT /api/gallery/{id}` - Update existing gallery item
  - `DELETE /api/gallery/{id}` - Delete gallery item
  - `PATCH /api/gallery/{id}/toggle-active` - Toggle active status

## Frontend Changes

### 1. Gallery Component
- **File**: `hospital/src/components/Gallery.jsx`
- **Changes**:
  - Added API integration with `fetchGalleryData()`
  - Added loading, error, and empty states
  - Added `getImagePath()` helper for proper image path construction
  - Dynamic image rendering from API data
  - Maintains existing drag-and-drop functionality

### 2. CSS Updates
- **File**: `hospital/src/components/Gallery.css`
- **Added**: Styles for loading, error, and empty states

## Image Path Handling

The `getImagePath()` helper function ensures proper image path construction:
- If image name starts with `/src/assets/`, use as-is
- Otherwise, prepend `/src/assets/` to the filename
- This prevents path duplication issues

## Usage

### 1. Database Setup
Run the SQL script `CreateGalleryTable.sql` to create the table and insert sample data.

### 2. API Testing
Test the endpoints using tools like Postman or curl:
```bash
# Get all gallery images
GET http://localhost:5000/api/gallery

# Create new gallery item
POST http://localhost:5000/api/gallery
Content-Type: application/json

{
  "title": "New Image",
  "description": "Description here",
  "image": "new-image.png",
  "orderIndex": 11
}
```

### 3. Frontend
The Gallery component will automatically fetch and display images from the API.

## Benefits

1. **Dynamic Content**: Gallery images can be managed through the database
2. **Scalability**: Easy to add/remove images without code changes
3. **Ordering**: Images can be reordered using the OrderIndex field
4. **Active/Inactive**: Images can be hidden without deletion
5. **Metadata**: Each image can have a title and description
6. **API Ready**: Full CRUD operations available for admin panel integration

## Future Enhancements

1. **Admin Panel**: Create AdminGallery component for managing gallery images
2. **Image Upload**: Implement file upload functionality
3. **Categories**: Add image categorization
4. **Lightbox**: Add image preview/zoom functionality
5. **Lazy Loading**: Implement lazy loading for better performance
