<?php
namespace App\models;
use App\config\Database; use PDO;

class User {
    public static function create(string $email, string $password): int {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = Database::connection()->prepare('INSERT INTO users (email,password_hash) VALUES (?,?)');
        $stmt->execute([$email,$hash]);
        return (int)Database::connection()->lastInsertId();
    }
    public static function findByEmail(string $email): ?array {
        $stmt = Database::connection()->prepare('SELECT * FROM users WHERE email=?');
        $stmt->execute([$email]);
        $row = $stmt->fetch(); return $row ?: null;
    }
}
