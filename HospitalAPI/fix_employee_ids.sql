-- Fix employee IDs for degrees and certificates
-- First, let's see what we have
SELECT 'Before fix - Degrees with employeeId = 0:' as info;
SELECT COUNT(*) as count FROM Employee_degrees WHERE employee_id = 0;

SELECT 'Before fix - Certificates with employeeId = 0:' as info;
SELECT COUNT(*) as count FROM Employee_certificates WHERE employee_id = 0;

-- Get employee IDs in order
SELECT 'Available employees:' as info;
SELECT id, fullname FROM Employees ORDER BY id;

-- Update degrees to assign them to employees in order
UPDATE Employee_degrees 
SET employee_id = (
    SELECT e.id 
    FROM Employees e 
    ORDER BY e.id 
    LIMIT 1 OFFSET (
        SELECT COUNT(*) 
        FROM Employee_degrees ed2 
        WHERE ed2.employee_id > 0 AND ed2.id < Employee_degrees.id
    )
)
WHERE employee_id = 0;

-- Update certificates to assign them to employees in order
UPDATE Employee_certificates 
SET employee_id = (
    SELECT e.id 
    FROM Employees e 
    ORDER BY e.id 
    LIMIT 1 OFFSET (
        SELECT COUNT(*) 
        FROM Employee_certificates ec2 
        WHERE ec2.employee_id > 0 AND ec2.id < Employee_certificates.id
    )
)
WHERE employee_id = 0;

-- Show results after fix
SELECT 'After fix - Degrees with valid employeeId:' as info;
SELECT COUNT(*) as count FROM Employee_degrees WHERE employee_id > 0;

SELECT 'After fix - Certificates with valid employeeId:' as info;
SELECT COUNT(*) as count FROM Employee_certificates WHERE employee_id > 0;

-- Show some examples
SELECT 'Sample degrees after fix:' as info;
SELECT ed.id, ed.employee_id, e.fullname, ed.university_name 
FROM Employee_degrees ed 
JOIN Employees e ON ed.employee_id = e.id 
LIMIT 5;

SELECT 'Sample certificates after fix:' as info;
SELECT ec.id, ec.employee_id, e.fullname, ec.certificate_name 
FROM Employee_certificates ec 
JOIN Employees e ON ec.employee_id = e.id 
LIMIT 5;
