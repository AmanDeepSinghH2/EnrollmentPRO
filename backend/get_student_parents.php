<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connection.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'faculty') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}

$sql = "SELECT ParentID, StudentID, ParentType, PhoneNumber FROM StudentParents ORDER BY ParentID DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$parents = [];
while ($row = $result->fetch_assoc()) {
    $parents[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($parents);
?>
