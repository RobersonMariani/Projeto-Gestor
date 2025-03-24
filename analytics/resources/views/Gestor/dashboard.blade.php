@extends('layouts.app')

@section('title', 'Gráficos de Desempenho dos Analistas')

@section('content')
    <div class="container">
        <div class="card mb-4 mt-5">
            <div class="card-body">
                <!-- Título Principal com Ícone Elaborado -->
                <div class="d-flex align-items-center mb-3">
                    <div class="me-3 icon-container">
                        <i class="fas fa-chart-line fa-2x custom-icon"></i>
                    </div>
                    <h1 class="card-title m-0">Gráficos de Desempenho dos Analistas</h1>
                </div>
                <p class="card-text text-muted">Visualize o desempenho dos analistas com base nas métricas selecionadas. Use
                    os filtros de data para refinar a visualização.</p>

                <!-- Filtros de Data -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <label for="startDate" class="form-label">De:</label>
                        <input type="date" id="startDate" class="form-control" placeholder="Data Inicial">
                    </div>
                    <div class="col-md-3">
                        <label for="endDate" class="form-label">Até:</label>
                        <input type="date" id="endDate" class="form-control" placeholder="Data Final"
                            value="{{ date('Y-m-d') }}">
                    </div>
                    <div class="col-md-3">
                        <label for="chartType" class="form-label">Exibir:</label>
                        <select id="chartType" class="form-select">
                            <option value="total">Total Geral</option>
                            <option value="day">Diferença de Dias</option>
                            <option value="month">Total por Mês</option>
                        </select>
                    </div>
                    <div class="col-md-3 align-self-end">
                        <button id="filterButton" class="btn btn-primary w-100">Filtrar</button>
                    </div>
                </div>

                <!-- Gráfico Geral -->
                <div class="card mb-5">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="me-3 icon-container">
                                <i class="fas fa-chart-bar fa-lg custom-icon"></i>
                            </div>
                            <h5 class="card-title m-0">Desempenho Geral</h5>
                        </div>
                        <canvas id="generalChart"></canvas>
                    </div>
                </div>

                <!-- Gráfico por Analista -->
                <div class="card mb-5">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="me-3 icon-container">
                                <i class="fas fa-user-tie fa-lg custom-icon"></i> <!-- Ícone alternativo -->
                            </div>
                            <h5 class="card-title m-0">Desempenho por Analista</h5>
                        </div>
                        <select id="analystSelect" class="mb-4 selectpicker" multiple
                            title="Selecione" {{-- data-style="btn-danger" --}} data-size="auto"
                            data-selected-text-format="count > 3" data-actions-box="true">
                            <!-- Opções de analistas serão carregadas dinamicamente -->
                        </select>
                        <div id="analystChartsContainer" class="row">
                            <!-- Os gráficos dos analistas serão gerados aqui -->
                        </div>
                    </div>
                </div>

                @include('Gestor.includes.podium')

            </div>
        </div>
    </div>
@endsection

@push('styles')
    <style>
        .custom-icon {
            color: #28a745;
            /* Verde Bootstrap */
            transition: transform 0.3s ease, color 0.3s ease;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            /* Sombra */
        }

        .icon-container {
            border: 2px solid #28a745;
            /* Bordas ao redor do ícone */
            border-radius: 50%;
            /* Deixar o contêiner circular */
            padding: 10px;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .icon-container:hover .custom-icon {
            transform: scale(1.2);
            /* Aumenta o ícone ao passar o mouse */
            color: #ffc107;
            /* Muda a cor do ícone no hover */
        }

        .icon-container:hover {
            transform: scale(1.1);
            /* Aumenta o contêiner ao passar o mouse */
            background-color: #28a745;
            /* Muda o fundo do contêiner no hover */
        }
    </style>
@endpush

@push('scripts')
    @vite('resources/js/charts.js')
@endpush
