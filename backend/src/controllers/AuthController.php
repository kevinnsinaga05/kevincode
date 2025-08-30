<?php
namespace App\controllers;
use App\models\User; use function App\helpers\json; use function App\helpers\body;

class AuthController {
    private static function token(array $payload): string {
        $secret = getenv('JWT_SECRET') ?: 'secret';
        $header = rtrim(strtr(base64_encode(json_encode(['alg'=>'HS256','typ'=>'JWT'])), '+/','-_'),'=');
        $body   = rtrim(strtr(base64_encode(json_encode($payload)), '+/','-_'),'=');
        $sig = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$body", $secret, true)), '+/','-_'),'=');
        return "$header.$body.$sig";
    }

    public static function register(): void {
        $d = body();
        if(empty($d['email'])||empty($d['password'])) { json(['error'=>'email & password required'],422); return; }
        if(User::findByEmail($d['email'])) { json(['error'=>'Email taken'],409); return; }
        $id = User::create($d['email'],$d['password']);
        json(['id'=>$id],201);
    }

    public static function login(): void {
        $d = body();
        $user = User::findByEmail($d['email']??'');
        if(!$user || !password_verify($d['password']??'', $user['password_hash'])) { json(['error'=>'Invalid credentials'],401); return; }
        $token = self::token(['sub'=>$user['id'],'email'=>$user['email'],'iat'=>time()]);
        json(['token'=>$token]);
    }
}
