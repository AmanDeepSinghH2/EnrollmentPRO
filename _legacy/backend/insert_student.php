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

$email = $data['email'] ?? '';
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$name = $data['name'] ?? '';
$address = $data['address'] ?? '';
$phoneNumber = $data['phoneNumber'] ?? '';
$dob = $data['dob'] ?? '';
$semester = $data['semester'] ?? 1;

if (empty($email) || empty($username) || empty($password) || empty($name)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email, Username, Password, and Name are required"]);
    exit;
}

// Hash the password before storing
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO Students (EmailID, Username, PasswordHash, Name, Address, PhoneNumber, DOB, Semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssi", $email, $username, $hashedPassword, $name, $address, $phoneNumber, $dob, $semester);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Student added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
