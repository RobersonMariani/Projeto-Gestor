@extends('layouts.app')

@section('title', 'Cadastro de Analistas')

@section('content')
    <div class="d-flex align-items-center justify-content-center main">
        <div class="card mx-auto">
            <div class="mb-3 p-3 rounded shadow-sm bg-light">
                <!-- Título Principal com Ícone Elaborado -->
                <div class="d-flex align-items-center mb-3 justify-content-center text-center">
                    <div class="me-3 icon-container">
                        <i class="fas fa-user-plus fa-2x custom-icon"></i>
                        {{-- <i class="fas fa-user fa-2x custom-icon"></i>
                    <i class="fas fa-user-cog fa-2x custom-icon"></i>
                    <i class="fas fa-users fa-2x custom-icon"></i>
                    <i class="fas fa-id-card fa-2x custom-icon"></i> --}}
                    </div>
                    <h1 class="card-title m-0">Cadastro de Analistas</h1>
                </div>
                <div class="card-body">
                    <!-- Elementos Empilhados e Centralizados -->
                    <div class="d-flex flex-column align-items-center">
                        <form id="registerAnalystForm">
                            <div class="mb-3 input">
                                <input type="text" name="name" id="name" class="form-control"
                                    placeholder="Digite o nome do Analista" required>
                            </div>
                            <div class="mb-3 input">
                                <select name="gestor_id" id="selectGestor" class="form-select">
                                    <option value="" disabled selected>Selecione o Gestor Responsável</option>
                                </select>
                            </div>
                            <button type="submit" id="register" class="btn btn-primary w-100">Cadastrar</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="p-3 rounded shadow-sm bg-light">
                <div class="d-flex align-items-center mb-3 justify-content-center text-center">
                    <div class="me-3 icon-container">
                        <i class="fas fa-users fa-2x custom-icon"></i>
                        {{-- <i class="fas fa-user fa-2x custom-icon"></i>
                    <i class="fas fa-user-cog fa-2x custom-icon"></i>
                    <i class="fas fa-user-plus fa-2x custom-icon"></i>
                    <i class="fas fa-id-card fa-2x custom-icon"></i> --}}
                    </div>
                    <h1 class="card-title m-0">Lista de Usuários Cadastrados</h1>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover rounded text-center" id="analysts">
                        <thead class="custom-table-header rounded-top">
                            <tr>
                                <th>Nome</th>
                                <th>Gestor Responsável</th>
                                <th>Data do Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="analysts-tbody">
                            <!-- Linhas de analistas serão inseridas aqui dinamicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    @include('modal.confirmDelete')
@endsection

@push('styles')
    <style>
        .card {
            padding: 30px;
        }

        .main {
            min-height: calc(100vh - 140px);
        }

        .input {
            width: 100%;
            max-width: 300px;
        }

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
    @vite('resources/js/registerAnalyst.js')
@endpush
