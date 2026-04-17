<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'faculty') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}
$user = $_SESSION['user'];

require_once 'db_connection.php';

// Fetch courses teaching
$coursesQuery = "SELECT c.Name AS course_name 
                 FROM Courses c 
                 JOIN CourseFaculty cf ON c.CourseID = cf.CourseID 
                 WHERE cf.FacultyID = ?";
$stmt = $conn->prepare($coursesQuery);
$stmt->bind_param("i", $user['userID']);
$stmt->execute();
$coursesResult = $stmt->get_result();
$courses = [];
while ($row = $coursesResult->fetch_assoc()) {
    $courses[] = $row;
}
$stmt->close();

// Return data as JSON
echo json_encode([
    'user' => [
        'name' => $user['name'],
        'userID' => $user['userID']
    ],
    'courses' => $courses
]);
?>
