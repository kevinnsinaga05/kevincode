<?php
namespace App\models;
use App\config\Database;

class Newsletter {
    public static function subscribe(string $email): bool {
        $stmt = Database::connection()->prepare('INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)');
        return $stmt->execute([$email]);
    }
}
