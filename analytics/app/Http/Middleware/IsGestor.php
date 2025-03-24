<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsGestor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = Auth::guard('api')->user();
            
            // Verifica se o usuário está autenticado e possui o relacionamento com gestor
            if ($user && $user->gestor()->exists()) {
                return $next($request);
            }

            // Retorna erro se o usuário não for autorizado
            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            // Captura exceções inesperadas e retorna uma mensagem de erro
            return response()->json(['error' => 'Erro interno do servidor: ' . $e->getMessage()], 500);
        }
    }
}
