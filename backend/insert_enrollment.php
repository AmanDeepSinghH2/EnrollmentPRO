<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
    exit;
}

$user = $_SESSION['user'];
$data = json_decode(file_get_contents('php://input'), true);

$studentID = ($user['role'] === 'student') ? $user['userID'] : ($data['studentID'] ?? '');
$status = $data['status'] ?? 'Pending';
$enrollmentDate = $data['enrollmentDate'] ?? date('Y-m-d');

if (empty($studentID)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "StudentID is required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO Enrollments (StudentID, Status, EnrollmentDate) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $studentID, $status, $enrollmentDate);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Enrollment added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
