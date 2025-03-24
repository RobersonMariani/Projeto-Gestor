<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Justification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class JustificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $justifications = Justification::all();
            return response()->json($justifications, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao listar justificativas', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'record_id' => 'required|exists:records,id',
                'field' => 'required|string',
                'justification' => 'required|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,csv,xlsx,xls',
            ]);

            $justification = new Justification();
            $justification->record_id     = $request->input('record_id');
            $justification->gestor_id     = 1; // auth()->user()->id;
            $justification->field         = $request->input('field');
            $justification->justification = $request->input('justification');

            if ($request->hasFile('file')) {
                $year  = date('Y');
                $month = date('m');
                $day   = date('d');
                $path  = "justifications/{$year}/{$month}/{$day}";

                $filename = $request->file('file')->getClientOriginalName();
                $filePath = $request->file('file')->storeAs($path, $filename, 'public');

                $justification->file_path = $filePath;
            }

            $justification->save();

            return response()->json(['message' => 'Justificativa salva com sucesso!'], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao salvar justificativa', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $justification = Justification::findOrFail($id);
            return response()->json($justification, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Justificativa não encontrada'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar justificativa', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'justification' => 'required|string',
                'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,csv,xlsx,xls',
            ]);

            $justification = Justification::findOrFail($id);
            $justification->justification = $request->input('justification');

            if ($request->hasFile('file')) {
                if ($justification->file_path && Storage::disk('public')->exists($justification->file_path)) {
                    Storage::disk('public')->delete($justification->file_path);
                }

                $year  = date('Y');
                $month = date('m');
                $day   = date('d');
                $path  = "justifications/{$year}/{$month}/{$day}";

                $filename = $request->file('file')->getClientOriginalName();
                $filePath = $request->file('file')->storeAs($path, $filename, 'public');

                $justification->file_path = $filePath;
            }

            $justification->save();

            return response()->json($justification, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Justificativa não encontrada'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar justificativa', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $justification = Justification::findOrFail($id);

            if ($justification->file_path && Storage::disk('public')->exists($justification->file_path)) {
                Storage::disk('public')->delete($justification->file_path);
            }

            $justification->delete();

            return response()->json(['message' => 'Justificativa removida com sucesso'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Justificativa não encontrada'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao remover justificativa', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get justifications by record ID and field name.
     */
    public function getByRecordAndField($recordId, $field)
    {
        try {
            $justifications = Justification::where('record_id', $recordId)
                ->where('field', $field)
                ->get();

            return response()->json($justifications, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar justificativas', 'message' => $e->getMessage()], 500);
        }
    }
}
