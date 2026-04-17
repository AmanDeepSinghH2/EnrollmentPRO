<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$sql = "SELECT FacultyID, Name, EmailID, PhoneNumber, DOB FROM Faculty ORDER BY FacultyID DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$faculty = [];
while ($row = $result->fetch_assoc()) {
    $faculty[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($faculty);
?>
