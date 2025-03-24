<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Analyst;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class AnalystController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $startDate = $request->input('start_date');

            $query = Analyst::with([
                'records' => function ($query) use ($startDate) {
                    $query->whereDate('date', '=', $startDate ?? Carbon::today());
                    $query->orderBy('date', 'desc');
                },
                'gestor'
            ])->orderBy('name', 'asc');

            $analysts = $query->get();

            return response()->json($analysts, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao listar analistas', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $analyst = Analyst::create($request->all());
            return response()->json($analyst, 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao criar analista', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $analyst = Analyst::findOrFail($id);
            return response()->json($analyst, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Analista não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar analista', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $analyst = Analyst::findOrFail($id);
            $analyst->update($request->all());

            return response()->json($analyst, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Analista não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar analista', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $analyst = Analyst::findOrFail($id);
            $analyst->delete();

            return response()->json(['message' => 'Analista removido com sucesso'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Analista não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao remover analista', 'message' => $e->getMessage()], 500);
        }
    }

    /*
    public function reports()
    {
        try {
            $justifications = DB::table('analysts as a')
                ->join('records as r', 'a.id', '=', 'r.analyst_id')
                ->join('justifications as j', 'r.id', '=', 'j.record_id')
                ->select('a.name as analyst_name', 'r.date as record_date', 'j.field as justification_field', 'j.justification as justification_text')
                ->orderBy('a.name')
                ->orderBy('r.date')
                ->get();

            return response()->json($justifications, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao gerar relatório', 'message' => $e->getMessage()], 500);
        }
    }
    */
}
