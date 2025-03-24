@extends('layouts.app')

@section('title', 'Login')

@section('content')
    <div class="d-flex align-items-center justify-content-center main">
        <div class="card mx-auto">
            <div class="card-body">
                <div class="d-flex align-items-center mb-4 justify-content-center text-center">
                    <div class="me-3 icon-container">
                        <i class="fas fa-sign-in-alt fa-2x custom-icon"></i>
                    </div>
                    <h2 class="card-title m-0">Login do Gestor</h2>
                </div>

                <div id="login-error" class="alert alert-danger d-none"></div>

                <form id="login-form">
                    @csrf
                    <div class="mb-3 input">
                        <label for="email" class="form-label">E-mail</label>
                        <input type="email" id="email" class="form-control" placeholder="Digite seu e-mail" required>
                    </div>

                    <div class="mb-3 input">
                        <label for="password" class="form-label">Senha</label>
                        <input type="password" id="password" class="form-control" placeholder="Digite sua senha" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Entrar</button>
                </form>
            </div>
        </div>
    </div>
@endsection

@push('styles')
    <style>
        html, body {
            height: 100%;
        }

        .main {
            min-height: calc(100vh - 140px);
        }

        .input {
            width: 100%;
            max-width: 350px;
            margin: 0 auto;
        }

        .card {
            padding: 80px;
        }

        .custom-icon {
            color: #0d6efd;
            transition: transform 0.3s ease, color 0.3s ease;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
        }

        .icon-container {
            border: 2px solid #0d6efd;
            border-radius: 50%;
            padding: 10px;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .icon-container:hover .custom-icon {
            transform: scale(1.2);
            color: #ffc107;
        }

        .icon-container:hover {
            transform: scale(1.1);
            background-color: #0d6efd;
        }
    </style>
@endpush

@push('scripts')
    @vite('resources/js/login.js')
@endpush
