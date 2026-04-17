<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'faculty') {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$studentID = $data['studentID'] ?? '';
$courseID = $data['courseID'] ?? '';
$grade = $data['grade'] ?? '';
$gradeDate = $data['gradeDate'] ?? date('Y-m-d');

if (empty($studentID) || empty($courseID) || empty($grade)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "StudentID, CourseID, and Grade are required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO Grades (StudentID, CourseID, Grade, GradeDate) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $studentID, $courseID, $grade, $gradeDate);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Grade added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
