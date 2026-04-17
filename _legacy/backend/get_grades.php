<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$user = $_SESSION['user'];

$sql = "SELECT g.GradeID, g.StudentID, s.Name AS StudentName, g.CourseID, c.Name AS CourseName, g.Grade, g.GradeDate 
        FROM Grades g
        JOIN Students s ON g.StudentID = s.StudentID
        JOIN Courses c ON g.CourseID = c.CourseID";

if ($user['role'] === 'student') {
    $sql .= " WHERE g.StudentID = ? ORDER BY g.GradeID DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user['userID']);
} else {
    $sql .= " ORDER BY g.GradeID DESC";
    $stmt = $conn->prepare($sql);
}

$stmt->execute();
$result = $stmt->get_result();
$grades = [];

while ($row = $result->fetch_assoc()) {
    $grades[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($grades);
?>
