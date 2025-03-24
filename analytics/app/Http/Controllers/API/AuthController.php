<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    // Registro de Gestor
    public function registerGestor(Request $request)
    {   
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);


            // Cria o usuário
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Cria o gestor relacionado
            $user->gestor()->create(['name' => $user->name]);

            return response()->json(['message' => 'Gestor registrado com sucesso!'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao registrar o gestor: ' . $e->getMessage()], 500);
        }
    }

    // Método de login
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!$token = Auth::guard('api')->attempt($credentials)) { // Certifique-se de usar o guard 'api'
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return $this->respondWithToken($token);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao fazer login: ' . $e->getMessage()], 500);
        }
    }

    // Método de logout
    public function logout()
    {
        try {
            Auth::guard('api')->logout(); // Usando o guard 'api' para fazer o logout
            return response()->json(['message' => 'Logout realizado com sucesso!']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao fazer logout: ' . $e->getMessage()], 500);
        }
    }

    // Método de refresh
    public function refresh()
    {
        try {
            $newToken = Auth::guard('api')->refresh(); // Renova o token JWT usando o guard 'api'
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Não foi possível renovar o token: ' . $e->getMessage()], 401);
        }
    }

    // Função para retornar o token JWT
    protected function respondWithToken($token)
    {
        try {
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => Auth::guard('api')->factory()->getTTL() * 60 // Certifique-se de usar o guard 'api'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao gerar resposta com o token: ' . $e->getMessage()], 500);
        }
    }
}
