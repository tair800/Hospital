-- Simple fix: assign degrees and certificates to employees in order
-- First, let's see the current state
SELECT 'Current state:' as info;
SELECT 'Degrees with employeeId = 0:' as type, COUNT(*) as count FROM Employee_degrees WHERE employee_id = 0
UNION ALL
SELECT 'Certificates with employeeId = 0:' as type, COUNT(*) as count FROM Employee_certificates WHERE employee_id = 0;

-- Simple approach: assign degrees to employees in order
-- We'll use a simple modulo approach to distribute them evenly
UPDATE Employee_degrees 
SET employee_id = ((Id - 1) % 12) + 1
WHERE employee_id = 0;

-- Assign certificates to employees in order
UPDATE Employee_certificates 
SET employee_id = ((Id - 1) % 12) + 1
WHERE employee_id = 0;

-- Show results
SELECT 'After fix:' as info;
SELECT 'Degrees with valid employeeId:' as type, COUNT(*) as count FROM Employee_degrees WHERE employee_id > 0
UNION ALL
SELECT 'Certificates with valid employeeId:' as type, COUNT(*) as count FROM Employee_certificates WHERE employee_id > 0;

-- Show some examples
SELECT 'Sample results:' as info;
SELECT 'Degree' as type, ed.Id, ed.employee_id, e.fullname, ed.university_name 
FROM Employee_degrees ed 
JOIN Employees e ON ed.employee_id = e.Id 
LIMIT 3
UNION ALL
SELECT 'Certificate' as type, ec.Id, ec.employee_id, e.fullname, ec.certificate_name 
FROM Employee_certificates ec 
JOIN Employees e ON ec.employee_id = e.Id 
LIMIT 3;
