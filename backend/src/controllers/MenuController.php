<?php
namespace App\controllers;

use App\models\MenuItem; use function App\helpers\json; use function App\helpers\body;

class MenuController {
    private static function validate(array $d, bool $partial=false): array {
        $errors=[]; $fields=['name','category','price'];
        foreach($fields as $f){ if(!$partial && empty($d[$f])) $errors[$f] = 'Required'; }
        if(isset($d['price']) && !is_numeric($d['price'])) $errors['price']='Must be numeric';
        return $errors;
    }

    public static function index(): void { json(MenuItem::all()); }
    public static function show(int $id): void { $item=MenuItem::find($id); $item? json($item): json(['error'=>'Not found'],404); }
    // Protected (needs JWT) -> route uses method name starting with auth_
    public static function auth_store(): void {
        $data=body(); $errors=self::validate($data); if($errors){ json(['errors'=>$errors],422); return; }
        $id=MenuItem::create($data); json(['id'=>$id],201);
    }
    public static function auth_update(int $id): void { $data=body(); $errors=self::validate($data); if($errors){ json(['errors'=>$errors],422); return; } $ok=MenuItem::update($id,$data); json(['updated'=>$ok]); }
    public static function auth_destroy(int $id): void { $ok=MenuItem::delete($id); json(['deleted'=>$ok]); }
}
