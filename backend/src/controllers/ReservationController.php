<?php
namespace App\controllers;
use App\models\Reservation; use function App\helpers\json; use function App\helpers\body;

class ReservationController {
    public static function store(): void {
        $d = body();
        $required = ['name','email','phone','date','time','people'];
        $errors=[]; foreach($required as $r){ if(empty($d[$r])) $errors[$r]='Required'; }
        if(!empty($d['email']) && !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $errors['email']='Invalid';
        if($errors){ json(['errors'=>$errors],422); return; }
        $id = Reservation::create($d);
        json(['id'=>$id],201);
    }
}
