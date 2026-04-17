<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'student') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$studentID = $_SESSION['user']['userID'];

$sql = "SELECT s.Semester, e.Status, COUNT(*) AS CoursesEnrolled, MAX(e.EnrollmentDate) AS LastEnrollmentDate
        FROM Enrollments e
        JOIN Students s ON e.StudentID = s.StudentID
        WHERE e.StudentID = ?
        GROUP BY s.Semester, e.Status";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $studentID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['message' => 'No enrollment records found for this student']);
    $stmt->close();
    $conn->close();
    exit;
}

$enrollmentStatus = $result->fetch_assoc();

$stmt->close();
$conn->close();

echo json_encode([
    'semester' => $enrollmentStatus['Semester'],
    'status' => $enrollmentStatus['Status'],
    'coursesEnrolled' => intval($enrollmentStatus['CoursesEnrolled']),
    'lastEnrollmentDate' => $enrollmentStatus['LastEnrollmentDate']
]);
?>
