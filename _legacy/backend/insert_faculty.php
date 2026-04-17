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

$name = $data['name'] ?? '';
$username = $data['username'] ?? '';
$emailid = $data['emailid'] ?? '';
$password = $data['password'] ?? '';
$phoneNumber = $data['phoneNumber'] ?? '';
$dob = $data['dob'] ?? '';

if (empty($name) || empty($username) || empty($emailid) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name, Username, EmailID, and Password are required"]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO Faculty (Username, PasswordHash, Name, EmailID, PhoneNumber, DOB) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $username, $passwordHash, $name, $emailid, $phoneNumber, $dob);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Faculty added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
