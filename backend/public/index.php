<?php
// Simple front controller
require __DIR__.'/../vendor/autoload.php';

// Load .env manually (simple)
$envPath = __DIR__.'/../.env';
if(file_exists($envPath)) {
    foreach(file($envPath, FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES) as $line){
        if(str_starts_with(trim($line),'#')) continue; [$k,$v]=array_map('trim',explode('=',$line,2)); putenv("$k=$v"); $_ENV[$k]=$v; }
}

// Basic security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){ http_response_code(204); exit; }

// Simple rate limit (per IP per minute)
$rateLimit = (int)(getenv('RATE_LIMIT_PER_MIN') ?: 60);
$bucketFile = sys_get_temp_dir().'/rl_'.md5($_SERVER['REMOTE_ADDR']);
$bucket = ['ts'=>time(),'count'=>0];
if(file_exists($bucketFile)) { $bucket = json_decode(file_get_contents($bucketFile), true) ?: $bucket; }
if(time() - $bucket['ts'] > 60) { $bucket=['ts'=>time(),'count'=>0]; }
$bucket['count']++;
file_put_contents($bucketFile, json_encode($bucket));
if($bucket['count'] > $rateLimit) { http_response_code(429); header('Content-Type: application/json'); echo json_encode(['error'=>'Too Many Requests']); exit; }

$routes = require __DIR__.'/../src/routes/api.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

$handled = false;
foreach($routes as [$m,$pattern,$handler]) {
    if($m !== $method) continue;
    $regex = '#^'.$pattern.'$#';
    if(preg_match($regex, $uri, $matches)) {
        array_shift($matches);
        [$class,$fn] = $handler;
        // Auth check if route protected (naming convention: needsAuth)
        if(str_starts_with($fn,'auth_')) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            if(!preg_match('/Bearer (.+)/',$authHeader,$m)) { http_response_code(401); echo json_encode(['error'=>'Missing token']); return; }
            $token = $m[1]; $secret = getenv('JWT_SECRET') ?: 'secret';
            [$h,$p,$s] = array_pad(explode('.',$token),3,'');
            $calc = rtrim(strtr(base64_encode(hash_hmac('sha256', "$h.$p", $secret, true)), '+/','-_'),'=');
            if($calc!==$s){ http_response_code(401); echo json_encode(['error'=>'Bad token']); return; }
            $payload = json_decode(base64_decode(strtr($p,'-_','+/')), true) ?: [];
            $_SERVER['user_id'] = $payload['sub'] ?? null;
        }
        $class::$fn(...array_map('intval',$matches));
        $handled=true; break;
    }
}
if(!$handled){
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error'=>'Route not found']);
}
