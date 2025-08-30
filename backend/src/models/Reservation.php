<?php
namespace App\models;
use App\config\Database;

class Reservation {
    public static function create(array $d): int {
        $stmt = Database::connection()->prepare('INSERT INTO reservations (name,email,phone,date,time,people,message) VALUES (?,?,?,?,?,?,?)');
        $stmt->execute([$d['name'],$d['email'],$d['phone'],$d['date'],$d['time'],$d['people'],$d['message']??null]);
        return (int)Database::connection()->lastInsertId();
    }
}
