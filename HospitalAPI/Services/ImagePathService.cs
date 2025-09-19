using System.Text.RegularExpressions;

namespace HospitalAPI.Services
{
    public static class ImagePathService
    {
        /// <summary>
        /// Format image path for frontend consumption
        /// </summary>
        /// <param name="imagePath">The image path from database</param>
        /// <returns>Properly formatted image path for frontend</returns>
        public static string FormatImagePath(string? imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return string.Empty;

            // If it's already a full URL or absolute path, return as is
            if (imagePath.StartsWith("http") || imagePath.StartsWith("/"))
                return imagePath;

            // For local assets, prefix with /src/assets/
            return $"/src/assets/{imagePath}";
        }

        /// <summary>
        /// Format image path for uploads
        /// </summary>
        /// <param name="imagePath">The image path from database</param>
        /// <returns>Properly formatted upload path for frontend</returns>
        public static string FormatUploadPath(string? imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return string.Empty;

            // If it's already a full URL or absolute path, return as is
            if (imagePath.StartsWith("http") || imagePath.StartsWith("/"))
                return imagePath;

            // For uploads, prefix with /uploads/
            return $"/uploads/{imagePath}";
        }

        /// <summary>
        /// Check if an image path is a local asset
        /// </summary>
        /// <param name="imagePath">The image path to check</param>
        /// <returns>True if it's a local asset</returns>
        public static bool IsLocalAsset(string? imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return false;

            // Common local asset patterns
            var localAssetPatterns = new[]
            {
                "contact-bg.png",
                "admin-bg.png",
                "blog1.png",
                "employee1.png",
                "event-img.png",
                "phone-icon.png",
                "location-icon.png",
                "mail-icon.png",
                "whatsapp-icon.png",
                "facebook.png",
                "instagram.png",
                "telegram.png",
                "youtube.png"
            };

            return localAssetPatterns.Any(pattern => imagePath.Contains(pattern));
        }

        /// <summary>
        /// Format image path based on context
        /// </summary>
        /// <param name="imagePath">The image path from database</param>
        /// <param name="context">The context: admin, gallery, blog, employee, event</param>
        /// <returns>Properly formatted image path for frontend</returns>
        public static string FormatContextualImagePath(string? imagePath, string context = "admin")
        {
            if (string.IsNullOrEmpty(imagePath))
                return string.Empty;

            // If it's already a full path, return as is
            if (imagePath.StartsWith("http") || imagePath.StartsWith("/"))
                return imagePath;

            // Check if it's a local asset
            if (IsLocalAsset(imagePath))
                return $"/src/assets/{imagePath}";

            // Check if it's an upload path (contains uploads/ or starts with uploads/)
            if (imagePath.StartsWith("uploads/") || imagePath.Contains("uploads/"))
                return $"/{imagePath}";

            // Check if it's an uploaded file by looking for GUID patterns or upload prefixes
            if (IsUploadedFile(imagePath))
                return $"/uploads/{imagePath}";

            // For different contexts, use appropriate paths
            return context switch
            {
                "gallery" or "blog" or "employee" or "event" => 
                    $"/src/assets/{imagePath}",
                "admin" or _ => 
                    $"/src/assets/{imagePath}"
            };
        }

        /// <summary>
        /// Check if an image path is an uploaded file
        /// </summary>
        /// <param name="imagePath">The image path to check</param>
        /// <returns>True if it's an uploaded file</returns>
        public static bool IsUploadedFile(string? imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return false;

            // Check for common upload file patterns
            var uploadPatterns = new[]
            {
                "about_",
                "employee_",
                "home_",
                "event_",
                "about_carousel_",
                "gallery_",
                "blog_"
            };

            return uploadPatterns.Any(pattern => imagePath.StartsWith(pattern));
        }

        /// <summary>
        /// Clean image path for database storage
        /// </summary>
        /// <param name="imagePath">The image path from frontend</param>
        /// <returns>Cleaned image path for database storage</returns>
        public static string CleanImagePathForStorage(string? imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return string.Empty;

            // Remove common prefixes
            var cleanedPath = imagePath
                .Replace("/src/assets/", "")
                .Replace("/uploads/", "")
                .Replace("src/assets/", "")
                .Replace("uploads/", "");

            return cleanedPath;
        }
    }
}
