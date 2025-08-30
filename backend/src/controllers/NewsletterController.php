<?php
namespace App\controllers;
use App\models\Newsletter; use function App\helpers\json; use function App\helpers\body;

class NewsletterController {
    public static function subscribe(): void {
        $d = body();
        if(empty($d['email']) || !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) { json(['error'=>'Valid email required'],422); return; }
        Newsletter::subscribe($d['email']);
        json(['subscribed'=>true]);
    }
}
