<?php
header('Content-Type: application/json');
require_once 'db_connection.php';

$sql = "SELECT CourseID, Name FROM Courses ORDER BY CourseID DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($courses);
?>
