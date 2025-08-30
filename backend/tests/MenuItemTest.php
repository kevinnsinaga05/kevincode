<?php
use PHPUnit\Framework\TestCase;
use App\models\MenuItem;
use App\config\Database;

final class MenuItemTest extends TestCase {
    public static function setUpBeforeClass(): void {
        // Use sqlite memory for tests (override env)
        putenv('DB_DRIVER=sqlite'); putenv('DB_NAME=:memory:');
        $pdo = Database::connection();
        $pdo->exec('CREATE TABLE menu_items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price REAL, description TEXT)');
    }

    public function testCreateAndFind(): void {
        $id = MenuItem::create(['name'=>'Test','category'=>'Cat','price'=>10,'description'=>'Desc']);
        $this->assertIsInt($id);
        $item = MenuItem::find($id);
        $this->assertEquals('Test', $item['name']);
    }
}
