<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class SupervisorController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validação dos dados
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Cria o usuário supervisor
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Relaciona o usuário como supervisor
            $user->supervisor()->create(['name' => $request->name]);

            return response()->json(['message' => 'Supervisor registrado com sucesso!'], 201);
        } catch (\Exception $e) {
            // Captura qualquer exceção e retorna uma mensagem de erro
            return response()->json(['error' => 'Erro ao registrar supervisor: ' . $e->getMessage()], 500);
        }
    }
}
