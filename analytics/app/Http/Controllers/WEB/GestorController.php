<?php

namespace App\Http\Controllers\WEB;

use App\Http\Controllers\Controller;
use App\Models\Gestor;
use Illuminate\Http\Request;

class GestorController extends Controller
{
    public function index()
    {
        return view('Gestor.dashboardOccurrences');
    }

    public function dashboard()
    {
        return view('Gestor.dashboard');
    }

    public function reports()
    {
        return view('Gestor.reports');
    }

    public function registerAnalyst()
    {
        return view('Gestor.registerAnalyst');
    }
}
