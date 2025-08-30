<?php
use App\controllers\MenuController;
use App\controllers\AuthController;
use App\controllers\ReservationController;
use App\controllers\NewsletterController;

return [
    ['GET','/menu', [MenuController::class,'index']],
    ['GET','/menu/(\d+)', [MenuController::class,'show']],
    ['POST','/menu', [MenuController::class,'auth_store']],
    ['PUT','/menu/(\d+)', [MenuController::class,'auth_update']],
    ['DELETE','/menu/(\d+)', [MenuController::class,'auth_destroy']],
    // Auth
    ['POST','/auth/register',[AuthController::class,'register']],
    ['POST','/auth/login',[AuthController::class,'login']],
    // Reservation & newsletter
    ['POST','/reservations',[ReservationController::class,'store']],
    ['POST','/newsletter/subscribe',[NewsletterController::class,'subscribe']],
];
