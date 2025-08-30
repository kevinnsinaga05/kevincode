<?php
namespace App\config;

use PDO; use PDOException; use RuntimeException;

class Database {
    private static ?PDO $conn = null;

    public static function connection(): PDO {
        if (self::$conn === null) {
            $driver = getenv('DB_DRIVER') ?: 'mysql';
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $port = getenv('DB_PORT') ?: '3306';
            $db   = getenv('DB_NAME') ?: 'soyatrack';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASS') ?: '';
            $dsn = "$driver:host=$host;port=$port;dbname=$db;charset=utf8mb4";
            try {
                self::$conn = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
            } catch (PDOException $e) {
                throw new RuntimeException('DB Connection failed: ' . $e->getMessage());
            }
        }
        return self::$conn;
    }
}
