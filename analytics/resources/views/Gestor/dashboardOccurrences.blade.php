@extends('layouts.app')

@section('title', 'Dashboard do Gestor')

@section('content')
    <div class="container">
        <div class="card mb-4 mt-5">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="me-3 icon-container">
                        <i class="fas fa-tachometer-alt fa-2x custom-icon"></i>
                    </div>
                    <h1 class="card-title m-0">Dashboard do Gestor</h1>
                </div>
                <p class="card-text text-muted">Gerencie as ocorrências dos analistas, incluindo atrasos, absenteísmos e
                    outras métricas importantes.</p>
                <!-- Filtros de Data -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <label for="startDate" class="form-label">Data:</label>
                        <input type="date" id="startDate" class="form-control" placeholder="Data Inicial">
                    </div>
                    <div class="col-md-3 align-self-end">
                        <button id="filterButton" class="btn btn-primary w-100">Filtrar</button>
                    </div>
                </div>

                <form id="record-form">
                    @csrf
                    <div class="table-responsive">
                        <table class="table table-striped table-hover rounded" id="analysts">
                            <thead class="custom-table-header rounded-top">
                                <tr>
                                    <th>Data</th>
                                    <th>Analista</th>
                                    <th>Atrasos</th>
                                    <th>Absenteísmo</th>
                                    <th>Retorno E-mails</th>
                                    <th>Erros Ct-es</th>
                                    <th>Falha Envio Ocorrências</th>
                                    <th>Falha Documentação Frota</th>
                                </tr>
                            </thead>
                            <tbody id="analysts-tbody">
                                <!-- Linhas de analistas serão inseridas aqui dinamicamente -->
                            </tbody>
                        </table>
                    </div>
                    <div class="d-flex justify-content-end mt-3">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Incluindo Modais -->
    @include('modal.justificationModal')
    @include('modal.viewJustificationsModal')
    @include('modal.confirmDeleteModal')
@endsection

@push('styles')
    <style>
        .custom-icon {
            color: #dc3545;
            /* Vermelho Bootstrap */
            transition: transform 0.3s ease, color 0.3s ease;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            /* Sombra */
        }

        .icon-container {
            border: 2px solid #dc3545;
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
            background-color: #dc3545;
            /* Muda o fundo do contêiner no hover */
        }
    </style>
@endpush

@push('scripts')
    @vite('resources/js/dashboardOccurrences.js')
@endpush
