<?php

use App\Http\Controllers\API\AnalystController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GestorController;
use App\Http\Controllers\API\JustificationController;
use App\Http\Controllers\API\RecordController;
use App\Http\Controllers\API\SupervisorController;

use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register/gestor', [AuthController::class, 'registerGestor']); // Se for público

Route::middleware(['auth:api'])->group(function () {
    Route::apiResource('gestors', GestorController::class);
    Route::apiResource('analysts', AnalystController::class);
    Route::apiResource('records', RecordController::class);
    Route::apiResource('justifications', JustificationController::class);
    Route::get('justifications/{recordId}/{field}', [JustificationController::class, 'getByRecordAndField']);

    //Rotas para gráficos
    Route::get('records/general/all', [RecordController::class, 'general']);
    Route::get('records/general/analyst/{id?}', [RecordController::class, 'generalAnalyst']);
    Route::get('records/podium/top-analysts', [RecordController::class, 'getTopAnalysts']);

    //Route::get('analysts/reports/justifications', [AnalystController::class, 'reports']);
    Route::get('records/reports/justifications', [RecordController::class, 'getReportData']);
    //Route::post('/register/supervisor', [AuthController::class, 'registerSupervisor']);

    Route::post('/register/supervisor', [SupervisorController::class, 'register']);
    //Route::post('/register/analyst', [AnalystController::class, 'register']);
    Route::get('/supervisors', [SupervisorController::class, 'index']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});
