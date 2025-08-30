<?php
// Script sederhana untuk menambah user admin ke database
// Simpan file ini di backend/src/ dan jalankan sekali saja dari browser atau terminal


require_once __DIR__ . '/config/database.php';
use App\config\Database;

$email = 'admin@email.com'; // Ganti sesuai kebutuhan
$password = '1234'; // Ganti sesuai kebutuhan
$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $pdo = Database::connection();
    $stmt = $pdo->prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    $stmt->execute([$email, $password_hash]);
    echo "User admin berhasil ditambahkan!";
} catch (PDOException $e) {
    echo "Gagal menambah user: " . $e->getMessage();
}
