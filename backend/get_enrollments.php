<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'faculty') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$sql = "SELECT e.EnrollmentID, e.StudentID, s.Name AS StudentName, e.Status, e.EnrollmentDate 
        FROM Enrollments e
        JOIN Students s ON e.StudentID = s.StudentID
        ORDER BY e.EnrollmentID DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$enrollments = [];
while ($row = $result->fetch_assoc()) {
    $enrollments[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($enrollments);
?>
