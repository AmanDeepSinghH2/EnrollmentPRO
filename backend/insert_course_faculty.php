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

$courseID = $data['courseID'] ?? '';
$facultyID = $data['facultyID'] ?? '';

if (empty($courseID) || empty($facultyID)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "CourseID and FacultyID are required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO CourseFaculty (CourseID, FacultyID) VALUES (?, ?)");
$stmt->bind_param("ii", $courseID, $facultyID);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Course-Faculty mapping added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
