<?php
namespace App\models;

use App\config\Database; use PDO;

class MenuItem {
    public int $id; public string $name; public string $category; public float $price; public ?string $description;

    public static function all(): array {
        $stmt = Database::connection()->query('SELECT * FROM menu_items ORDER BY id DESC');
        return $stmt->fetchAll();
    }

    public static function find(int $id): ?array {
        $stmt = Database::connection()->prepare('SELECT * FROM menu_items WHERE id=?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): int {
        $stmt = Database::connection()->prepare('INSERT INTO menu_items (name, category, price, description) VALUES (?,?,?,?)');
        $stmt->execute([
            $data['name'], $data['category'], $data['price'], $data['description'] ?? null
        ]);
        return (int)Database::connection()->lastInsertId();
    }

    public static function update(int $id, array $data): bool {
        $stmt = Database::connection()->prepare('UPDATE menu_items SET name=?, category=?, price=?, description=? WHERE id=?');
        return $stmt->execute([
            $data['name'], $data['category'], $data['price'], $data['description'] ?? null, $id
        ]);
    }

    public static function delete(int $id): bool {
        $stmt = Database::connection()->prepare('DELETE FROM menu_items WHERE id=?');
        return $stmt->execute([$id]);
    }
}
