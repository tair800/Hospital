-- Create Gallery Table
CREATE TABLE Gallery (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    Image NVARCHAR(500) NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert sample gallery images
INSERT INTO Gallery (Title, Description, Image) VALUES
('Gallery Image 1', 'Beautiful hospital environment', 'gallery1.png'),
('Gallery Image 2', 'Modern medical facilities', 'gallery2.png'),
('Gallery Image 3', 'Professional medical staff', 'gallery3.png'),
('Gallery Image 4', 'Advanced equipment', 'gallery4.png'),
('Gallery Image 5', 'Patient care areas', 'gallery5.png'),
('Gallery Image 6', 'Reception area', 'gallery6.png'),
('Gallery Image 7', 'Consultation rooms', 'gallery7.png'),
('Gallery Image 8', 'Treatment facilities', 'gallery8.png'),
('Gallery Image 9', 'Laboratory services', 'gallery9.png'),
('Gallery Image 10', 'Emergency department', 'gallery10.png');

-- Create index for active status
CREATE INDEX IX_Gallery_IsActive ON Gallery(IsActive);
