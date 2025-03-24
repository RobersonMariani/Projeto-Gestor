<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class RecordController extends Controller
{
    public function index()
    {
        try {
            return response()->json(Record::all(), 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao listar registros', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $analyst_ids                 = $request->input('analyst_id[]', []);
            $late                        = $request->input('late[]', []);
            $absenteeism                 = $request->input('absenteeism[]', []);
            $return_emails               = $request->input('return_emails[]', []);
            $errors_ctes                 = $request->input('errors_ctes[]', []);
            $failure_send_occurrences    = $request->input('failure_send_occurrences[]', []);
            $fleet_documentation_failure = $request->input('fleet_documentation_failure[]', []);
            $date                        = $request->input('date', now()->format('Y-m-d'));

            if (!is_array($analyst_ids) || count($analyst_ids) === 0) {
                return response()->json(['message' => 'Erro ao processar registros: Nenhum analista encontrado.'], 400);
            }

            $recordIds = [];

            foreach ($analyst_ids as $index => $analyst_id) {
                $record = Record::where('analyst_id', $analyst_id)
                    ->whereDate('date', $date)
                    ->first();

                if ($record) {
                    $record->update([
                        'late' => $late[$index] ?? $record->late,
                        'absenteeism' => $absenteeism[$index] ?? $record->absenteeism,
                        'return_emails' => $return_emails[$index] ?? $record->return_emails,
                        'errors_ctes' => $errors_ctes[$index] ?? $record->errors_ctes,
                        'failure_send_occurrences' => $failure_send_occurrences[$index] ?? $record->failure_send_occurrences,
                        'fleet_documentation_failure' => $fleet_documentation_failure[$index] ?? $record->fleet_documentation_failure,
                    ]);
                    $recordIds[$analyst_id] = $record->id;
                } else {
                    $newRecord = Record::create([
                        'analyst_id' => $analyst_id,
                        'date' => $date,
                        'late' => $late[$index] ?? null,
                        'absenteeism' => $absenteeism[$index] ?? null,
                        'return_emails' => $return_emails[$index] ?? null,
                        'errors_ctes' => $errors_ctes[$index] ?? null,
                        'failure_send_occurrences' => $failure_send_occurrences[$index] ?? null,
                        'fleet_documentation_failure' => $fleet_documentation_failure[$index] ?? null,
                    ]);
                    $recordIds[$analyst_id] = $newRecord->id;
                }
            }

            return response()->json(['message' => 'Registros atualizados com sucesso', 'recordIds' => $recordIds], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao salvar registros', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            return response()->json(Record::findOrFail($id), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Registro não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar registro', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $record = Record::findOrFail($id);
            $record->update($request->all());
            return response()->json($record, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Registro não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao atualizar registro', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $record = Record::findOrFail($id);
            $record->delete();
            return response()->json(['message' => 'Registro removido com sucesso'], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Registro não encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao remover registro', 'message' => $e->getMessage()], 500);
        }
    }

    public function general(Request $request)
    {
        try {
            $startDate = $request->input('start_date') ?? now();
            $endDate = $request->input('end_date') ?? now();
            $type = $request->input('type', 'total');

            if ($type === 'day') {
                return $this->getGeneralWithDifferenceDay($startDate, $endDate);
            } elseif ($type === 'month') {
                return $this->getGeneralByMonth($startDate, $endDate);
            } else {
                return $this->getGeneralTotal($startDate, $endDate);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao gerar dados gerais', 'message' => $e->getMessage()], 500);
        }
    }

    private function getGeneralTotal($startDate, $endDate)
    {
        try {
            $query = Record::withTrashed();

            if ($startDate) {
                $query->whereDate('date', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('date', '<=', $endDate);
            }

            $data = $query->selectRaw('
                SUM(late) as late,
                SUM(absenteeism) as absenteeism,
                SUM(return_emails) as return_emails,
                SUM(errors_ctes) as errors_ctes,
                SUM(failure_send_occurrences) as failure_send_occurrences,
                SUM(fleet_documentation_failure) as fleet_documentation_failure
            ')->first();

            return response()->json($data);
        } catch (Exception $e) {
            Log::error('Erro em getGeneralTotal: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao calcular total geral'], 500);
        }
    }

    private function getGeneralWithDifferenceDay($startDate, $endDate)
    {
        try {
            $query = Record::withTrashed();

            if ($startDate) {
                $query->whereDate('date', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('date', '<=', $endDate);
            }

            $records = $query->selectRaw('
                date,
                SUM(late) as late,
                SUM(absenteeism) as absenteeism,
                SUM(return_emails) as return_emails,
                SUM(errors_ctes) as errors_ctes,
                SUM(failure_send_occurrences) as failure_send_occurrences,
                SUM(fleet_documentation_failure) as fleet_documentation_failure
            ')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json($records);
        } catch (Exception $e) {
            Log::error('Erro em getGeneralWithDifferenceDay: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao calcular diferença por dias'], 500);
        }
    }

    private function getGeneralByMonth($startDate, $endDate)
    {
        try {
            $query = Record::withTrashed();

            if ($startDate && $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }

            $records = $query->selectRaw('
                YEAR(date) as year,
                MONTH(date) as month,
                SUM(late) as late,
                SUM(absenteeism) as absenteeism,
                SUM(return_emails) as return_emails,
                SUM(errors_ctes) as errors_ctes,
                SUM(failure_send_occurrences) as failure_send_occurrences,
                SUM(fleet_documentation_failure) as fleet_documentation_failure
            ')
                ->groupBy('year', 'month')
                ->get();

            return response()->json($records);
        } catch (Exception $e) {
            Log::error('Erro em getGeneralByMonth: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao agrupar registros por mês'], 500);
        }
    }

    public function generalAnalyst(Request $request)
    {
        try {
            $startDate = $request->input('start_date') ?? now();
            $endDate = $request->input('end_date') ?? now();
            $type = $request->input('type', 'total');
            $analystIds = $request->input('analyst_ids');

            if ($analystIds && count($analystIds) > 0) {
                if ($type === 'day') {
                    return $this->getAnalystsWithDifferenceDay($analystIds, $startDate, $endDate);
                } elseif ($type === 'month') {
                    return $this->getAnalystsByMonth($analystIds, $startDate, $endDate);
                } else {
                    return $this->getAnalystsTotal($analystIds, $startDate, $endDate);
                }
            } else {
                return response()->json(['error' => 'Nenhum analista selecionado.'], 400);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao gerar dados por analista', 'message' => $e->getMessage()], 500);
        }
    }

    private function getAnalystsTotal($analystIds, $startDate, $endDate)
    {
        try {
            $query = Record::whereIn('analyst_id', $analystIds);

            if ($startDate) {
                $query->whereDate('date', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('date', '<=', $endDate);
            }

            $data = $query->selectRaw('
                analyst_id,
                SUM(late) as late,
                SUM(absenteeism) as absenteeism,
                SUM(return_emails) as return_emails,
                SUM(errors_ctes) as errors_ctes,
                SUM(failure_send_occurrences) as failure_send_occurrences,
                SUM(fleet_documentation_failure) as fleet_documentation_failure
            ')
                ->groupBy('analyst_id')
                ->with('analyst')
                ->get();

            return response()->json($data);
        } catch (Exception $e) {
            Log::error('Erro em getAnalystsTotal: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao calcular total por analista'], 500);
        }
    }

    private function getAnalystsWithDifferenceDay($analystIds, $startDate, $endDate)
    {
        try {
            $query = Record::whereIn('analyst_id', $analystIds);

            if ($startDate) {
                $query->whereDate('date', '>=', $startDate);
            }

            if ($endDate) {
                $query->whereDate('date', '<=', $endDate);
            }

            $records = $query->selectRaw('
                date,
                analyst_id,
                SUM(late) as late,
                SUM(absenteeism) as absenteeism,
                SUM(return_emails) as return_emails,
                SUM(errors_ctes) as errors_ctes,
                SUM(failure_send_occurrences) as failure_send_occurrences,
                SUM(fleet_documentation_failure) as fleet_documentation_failure
            ')
                ->groupBy('date', 'analyst_id')
                ->with('analyst')
                ->orderBy('date')
                ->get();

            return response()->json($records);
        } catch (Exception $e) {
            Log::error('Erro em getAnalystsWithDifferenceDay: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao calcular diferença por dia por analista'], 500);
        }
    }

    private function getAnalystsByMonth($analystIds, $startDate, $endDate)
    {
        try {
            $query = Record::whereIn('analyst_id', $analystIds);

            if ($startDate && $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }

            $records = $query->selectRaw('
                YEAR(date) as year,
                MONTH(date) as month,
                analyst_id,
                SUM(late) as late,
                SUM(absenteeism) as absenteeism,
                SUM(return_emails) as return_emails,
                SUM(errors_ctes) as errors_ctes,
                SUM(failure_send_occurrences) as failure_send_occurrences,
                SUM(fleet_documentation_failure) as fleet_documentation_failure
            ')
                ->groupBy('year', 'month', 'analyst_id')
                ->with('analyst')
                ->get();

            return response()->json($records);
        } catch (Exception $e) {
            Log::error('Erro em getAnalystsByMonth: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao agrupar registros mensais por analista'], 500);
        }
    }

    public function getTopAnalysts(Request $request)
    {
        try {
            $startDate  = $request->input('start_date') ?? now()->startOfMonth();
            $endDate    = $request->input('end_date') ?? now()->endOfMonth();
            $analystIds = $request->input('analyst_ids');

            $query = Record::select(
                'analyst_id',
                DB::raw('SUM(IFNULL(late, 0) + IFNULL(absenteeism, 0) + IFNULL(return_emails, 0) + IFNULL(errors_ctes, 0) + IFNULL(failure_send_occurrences, 0) + IFNULL(fleet_documentation_failure, 0)) AS total_occurrences'),
                DB::raw('((CASE WHEN SUM(IFNULL(late, 0)) > 0 THEN 1 ELSE 0 END) + (CASE WHEN SUM(IFNULL(absenteeism, 0)) > 0 THEN 1 ELSE 0 END) + (CASE WHEN SUM(IFNULL(return_emails, 0)) > 0 THEN 1 ELSE 0 END) + (CASE WHEN SUM(IFNULL(errors_ctes, 0)) > 0 THEN 1 ELSE 0 END) + (CASE WHEN SUM(IFNULL(failure_send_occurrences, 0)) > 0 THEN 1 ELSE 0 END) + (CASE WHEN SUM(IFNULL(fleet_documentation_failure, 0)) > 0 THEN 1 ELSE 0 END)) AS indices_with_errors')
            )
                ->whereBetween('date', [$startDate, $endDate])
                ->groupBy('analyst_id')
                ->orderBy('total_occurrences', 'asc')
                ->orderBy('indices_with_errors', 'asc')
                ->limit(3);

            if ($analystIds) {
                $query->whereNotIn('analyst_id', $analystIds);
            }

            $topAnalysts = $query->with('analyst')->get();

            return response()->json($topAnalysts);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao buscar top analistas', 'message' => $e->getMessage()], 500);
        }
    }

    public function getReportData(Request $request)
    {
        try {
            $analystIds = $request->input('analyst_ids', []);
            $occurrenceTypes = $request->input('occurrence_types', []);
            $startDate = $request->input('start_date') ?? now()->format('Y-m-d');
            $endDate = $request->input('end_date') ?? now()->format('Y-m-d');

            $query = Record::query();

            if (!empty($analystIds)) {
                $query->whereIn('analyst_id', $analystIds);
            }

            if ($startDate && $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            } elseif ($startDate) {
                $query->whereDate('date', '>=', $startDate);
            } elseif ($endDate) {
                $query->whereDate('date', '<=', $endDate);
            }

            if (!empty($occurrenceTypes)) {
                $query->where(function ($q) use ($occurrenceTypes) {
                    foreach ($occurrenceTypes as $type) {
                        $q->orWhere($type, '>', 0);
                    }
                });
            }

            $records = $query->with(['analyst', 'justification'])
                ->orderBy('date', 'asc')
                ->get()
                ->toArray();

            $data = collect($records)->flatMap(function ($record) use ($occurrenceTypes) {
                $justifications = collect($record['justification']);

                if (!empty($occurrenceTypes)) {
                    $justifications = $justifications->whereIn('field', $occurrenceTypes);
                }

                return $justifications->map(function ($justification) use ($record) {
                    return [
                        'analyst_name' => $record['analyst']['name'],
                        'record_date' => $record['date'],
                        'justification_field' => $justification['field'],
                        'justification_text' => $justification['justification'],
                    ];
                });
            })->toArray();

            return response()->json($data);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erro ao gerar relatório de justificativas', 'message' => $e->getMessage()], 500);
        }
    }
}
