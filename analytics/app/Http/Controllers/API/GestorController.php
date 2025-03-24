<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Gestor;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class GestorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $gestores = Gestor::all();
            return response()->json($gestores, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao listar gestores', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $gestor = Gestor::create($request->all());
            return response()->json($gestor, 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao criar gestor', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $gestor = Gestor::findOrFail($id);
            return response()->json($gestor, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Gestor não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar gestor', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $gestor = Gestor::findOrFail($id);
            $gestor->update($request->all());
            return response()->json($gestor, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Gestor não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar gestor', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $gestor = Gestor::findOrFail($id);
            $gestor->delete();

            return response()->json(['message' => 'Gestor removido com sucesso'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Gestor não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao remover gestor', 'message' => $e->getMessage()], 500);
        }
    }
}
