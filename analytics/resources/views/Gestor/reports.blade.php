@extends('layouts.app')

@section('title', 'Relatório de Ocorrências')

@section('content')
    <div class="container">

        <div class="card mb-4 mt-2">
            <div class="card-body">
                <div class="row">
                    <div class="col-2">
                        <label class="form-label">Analista:</label>
                        <select class="selectpicker" id="filterSelectAnalyst" multiple title="Selecione" data-size="auto"
                            data-selected-text-format="count > 3" data-actions-box="true"></select>
                    </div>
                    <div class="col-2 mx-3">
                        <label class="form-label">Ocorrência:</label>
                        <select class="selectpicker" id="filterSelectOcurrence" multiple title="Selecione" data-size="auto"
                            data-selected-text-format="count > 3" data-actions-box="true"></select>
                    </div>
                    <div class="col-2">
                        <label class="form-label">Data início:</label>
                        <input type="date" id="startDate" class="form-control" placeholder="Data Inicial">
                    </div>
                    <div class="col-2">
                        <label class="form-label">Data Final:</label>
                        <input type="date" id="endDate" class="form-control" placeholder="Data Final"
                            value="{{ date('Y-m-d') }}">
                    </div>
                </div>
            </div>

            <div class="card-footer">
                <button type="button" class="btn btn-primary" id="filterButton">Pesquisar</button>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover rounded " id="reports">
                        <thead class="custom-table-header rounded-top">
                            <tr>
                                <th>Data</th>
                                <th>Analista</th>
                                <th width="20%">Ocorrência</th>
                                <th>Justificativa</th>
                            </tr>
                        </thead>
                        <tbody id="reports-tbody">
                            <!-- Linhas de analistas serão inseridas aqui dinamicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('styles')
    <link href="https://cdn.datatables.net/buttons/2.1.1/css/buttons.dataTables.min.css" rel="stylesheet">
@endpush

@push('scripts')
    @vite('resources/js/reports.js')
    <script src="https://cdn.datatables.net/buttons/2.1.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.1.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.1.1/js/buttons.print.min.js"></script>
@endpush
