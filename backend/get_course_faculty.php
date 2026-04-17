<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'faculty') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$sql = "SELECT cf.ID, c.CourseID, c.Name AS CourseName, f.FacultyID, f.Name AS FacultyName 
        FROM CourseFaculty cf
        JOIN Courses c ON cf.CourseID = c.CourseID
        JOIN Faculty f ON cf.FacultyID = f.FacultyID
        ORDER BY cf.ID DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$mappings = [];
while ($row = $result->fetch_assoc()) {
    $mappings[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($mappings);
?>
