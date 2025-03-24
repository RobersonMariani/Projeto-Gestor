<?php

use App\Http\Controllers\WEB\GestorController;
use App\Http\Controllers\WEB\LoginController;
use Illuminate\Support\Facades\Route;


Route::get('/gestores/dashboard-ocorrencias', [GestorController::class, 'index']);
Route::get('/gestores/dashboard', [GestorController::class, 'dashboard']);
Route::get('/gestores/reports', [GestorController::class, 'reports']);
Route::get('/gestores/registerAnalyst', [GestorController::class, 'registerAnalyst']);

Route::get('/', [LoginController::class, 'index'])->name('login');
