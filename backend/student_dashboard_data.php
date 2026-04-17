session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'student') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized access']);
    exit;
}
$user = $_SESSION['user'];

require_once 'db_connection.php';

// Fetch enrolled courses
$coursesQuery = "SELECT c.Name AS course_name 
                 FROM Enrollments e 
                 JOIN Courses c ON e.CourseID = c.CourseID 
                 WHERE e.StudentID = ?";
$stmt = $conn->prepare($coursesQuery);
$stmt->bind_param("i", $user['userID']);
$stmt->execute();
$coursesResult = $stmt->get_result();
$courses = [];
while ($row = $coursesResult->fetch_assoc()) {
    $courses[] = $row;
}
$stmt->close();

// Fetch general enrollment details
$enrollmentQuery = "SELECT Semester AS semester, Status AS enrollment_status, EnrollmentDate AS valid_till 
                   FROM Enrollments 
                   WHERE StudentID = ? 
                   ORDER BY EnrollmentDate DESC LIMIT 1";
$stmt = $conn->prepare($enrollmentQuery);
$stmt->bind_param("i", $user['userID']);
$stmt->execute();
$enrollmentResult = $stmt->get_result();
$enrollment = $enrollmentResult->fetch_assoc();
$stmt->close();

// Return data as JSON (with defaults)
echo json_encode([
    'user' => [
        'name' => $user['name'],
        'userID' => $user['userID']
    ],
    'courses' => $courses,
    'enrollment' => $enrollment ?: [
        'semester' => 'N/A',
        'enrollment_status' => 'Not Enrolled',
        'valid_till' => 'N/A'
    ]
]);
?>
