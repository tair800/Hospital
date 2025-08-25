# Hospital API - New Entities Documentation

This document describes the new entities that have been added to the Hospital API based on the data files from the frontend.

## New Entities Added

### 1. Blog Entity
- **Table**: `Blogs`
- **Purpose**: Stores blog articles and medical information
- **Key Fields**:
  - `Number`: Blog number/identifier
  - `Title`: Blog title
  - `Description`: Short description
  - `Date`: Publication date
  - `Visitors`: Number of visitors
  - `SecondDescTitle` & `SecondDescBody`: Additional content sections
  - `ThirdTextTitle` & `ThirdTextBody`: More content sections

### 2. Contact Entity
- **Table**: `Contacts`
- **Purpose**: Stores contact information (phone, email, location, etc.)
- **Key Fields**:
  - `Type`: Contact type (phone, whatsapp, email, location)
  - `Value`: Contact value
  - `Icon`: Associated icon filename

### 3. SocialMedia Entity
- **Table**: `SocialMedia`
- **Purpose**: Stores social media links and information
- **Key Fields**:
  - `Platform`: Social media platform name
  - `Name`: Display name
  - `Url`: Social media URL
  - `Icon`: Associated icon filename

### 4. ContactHeading Entity
- **Table**: `ContactHeadings`
- **Purpose**: Stores contact page heading text
- **Key Fields**:
  - `Line1`: First line of heading
  - `Line2`: Second line of heading

### 5. Logo Entity
- **Table**: `Logos`
- **Purpose**: Stores logo images and names
- **Key Fields**:
  - `Name`: Logo name/identifier
  - `Image`: Logo image path

### 6. AboutCarousel Entity
- **Table**: `AboutCarousel`
- **Purpose**: Stores about page carousel/slider items
- **Key Fields**:
  - `Name`: Item name/title
  - `Image`: Carousel image path

## API Endpoints

### Blogs API
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/{id}` - Get specific blog
- `GET /api/blogs/featured` - Get featured blogs (most visited)
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/{id}` - Update blog
- `DELETE /api/blogs/{id}` - Delete blog

### Contacts API
- `GET /api/contacts` - Get all contact information (combined)
- `GET /api/contacts/contact-info` - Get only contact information
- `GET /api/contacts/social-media` - Get only social media
- `GET /api/contacts/heading` - Get contact heading
- `POST /api/contacts/contact-info` - Create new contact
- `POST /api/contacts/social-media` - Create new social media
- `PUT /api/contacts/contact-info/{id}` - Update contact
- `PUT /api/contacts/social-media/{id}` - Update social media
- `PUT /api/contacts/heading/{id}` - Update contact heading

### Logos API
- `GET /api/logos` - Get all logos
- `GET /api/logos/{id}` - Get specific logo
- `POST /api/logos` - Create new logo
- `PUT /api/logos/{id}` - Update logo
- `DELETE /api/logos/{id}` - Delete logo

### AboutCarousel API
- `GET /api/aboutcarousel` - Get all carousel items
- `GET /api/aboutcarousel/{id}` - Get specific carousel item
- `POST /api/aboutcarousel` - Create new carousel item
- `PUT /api/aboutcarousel/{id}` - Update carousel item
- `DELETE /api/aboutcarousel/{id}` - Delete carousel item

## Database Setup

### Option 1: Run the Complete Script
Execute the `CreateAllTables.sql` script to create all tables and insert sample data at once.

### Option 2: Run Individual Scripts
Execute the individual SQL scripts:
- `CreateBlogsTable.sql`
- `CreateContactsTable.sql`
- `CreateLogosTable.sql`
- `CreateAboutCarouselTable.sql`

### Option 3: Use Entity Framework Migrations
If you prefer to use EF migrations:

1. Add the new entities to your DbContext
2. Run: `dotnet ef migrations add AddNewEntities`
3. Run: `dotnet ef database update`

## Sample Data

All tables come with sample data that matches the structure from the frontend data files:
- **Blogs**: 8 sample medical blog articles
- **Contacts**: Phone, WhatsApp, email, and location
- **Social Media**: Facebook, Instagram, LinkedIn, YouTube, Telegram
- **Logos**: 14 sample logo entries
- **About Carousel**: 8 sample carousel items

## Features

- **Unicode Support**: All text fields support Azerbaijani characters (NVARCHAR)
- **Audit Fields**: CreatedAt and UpdatedAt timestamps on all entities
- **Proper Validation**: Required fields and length constraints
- **Error Handling**: Comprehensive error handling in all controllers
- **RESTful Design**: Standard REST API patterns

## Usage Examples

### Get All Blogs
```http
GET /api/blogs
```

### Get Featured Blogs
```http
GET /api/blogs/featured
```

### Get Complete Contact Information
```http
GET /api/contacts
```

### Get All Logos
```http
GET /api/logos
```

### Get About Carousel Items
```http
GET /api/aboutcarousel
```

## Notes

- All entities include `CreatedAt` and `UpdatedAt` timestamps
- Text fields use NVARCHAR for proper Unicode support
- Sample data is automatically inserted when tables are created
- Controllers include comprehensive error handling
- API follows RESTful conventions
- All endpoints return JSON responses
