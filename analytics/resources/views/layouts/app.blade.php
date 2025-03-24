<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title', config('app.name', 'Laravel'))</title>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Styles -->
    {{-- <link href="{{ asset('css/app.css') }}" rel="stylesheet"> --}}

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/css/bootstrap-select.min.css">

    {{-- <!-- Custom CSS (Opcional) -->
    <link href="{{ asset('css/custom.css') }}" rel="stylesheet"> --}}

    <!-- DataTables -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    @stack('styles')
    @vite(['resources/js/app.js', 'resources/css/app.css'])

    <!-- DataTables - Jquery-->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>

    <!-- CHARTS JS -->
    {{-- <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.js"></script> --}}
</head>

<body>
    <!-- Header -->
    <nav class="navbar navbar-expand-lg nav">
        <div class="container-fluid custom-navbar">
            <a class="navbar-brand d-flex align-items-center text-white"
                href="{{ url('/gestores/dashboard-ocorrencias') }}">
                <div class="icon-stack">
                    <i class="fas fa-truck fa-lg me-1 custom-icon"></i> <!-- Ícone de caminhão -->
                    <i class="fas fa-chart-line fa-lg me-2 custom-icon stacked-icon"></i>
                </div>
                <span class="custom-text">{{ config('app.name', 'ANALYTICS') }}</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav" style="display: none;" data-auth-nav>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link text-white" href="{{ url('/gestores/dashboard-ocorrencias') }}">
                            <i class="fas fa-exclamation-circle me-2"></i>Ocorrências <!-- Ícone para Ocorrências -->
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="{{ url('/gestores/dashboard') }}">
                            <i class="fas fa-tachometer-alt me-2"></i>Dashboard <!-- Ícone para Dashboard -->
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-white" href="{{ url('/gestores/reports') }}">
                            <i class="fas fa-file-alt me-2"></i>Relatório <!-- Ícone para Dashboard -->
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="btn btn-secondary dropdown-toggle" style="border: none;" href="#" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false" href="#" id="gestorPanelDropdown">
                            <i class="fas fa-user-tie me-2"></i>Painel do Gestor
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="gestorPanelDropdown">
                            <li><a class="dropdown-item bg-houver-custom"
                                    href="{{ url('/gestores/registerAnalyst') }}">Gerenciar
                                    analistas</a></li>
                            {{--  <li><hr class="dropdown-divider"></li> --}}
                        </ul>
                    </li>
                    {{--  Adicione mais links conforme necessário --}}
                </ul>
            </div>

        </div>
    </nav>

    <!-- Content -->
    <div class="container-fluid mt-6">
        @yield('content')
    </div>

    <!-- Footer -->
    <footer class="footer py-3">
        <div class="container">
            <span class="text-white">© {{ date('Y') }} - Roberson Mariani. Todos os direitos reservados.</span>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Bootstrap Select JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta3/dist/js/bootstrap-select.min.js"></script>
    {{-- <script src="{{ asset('js/app.js') }}"></script> --}}
    <script>
        $.fn.selectpicker.defaults = {
            noneSelectedText: 'Nada selecionado',
            noneResultsText: 'Nenhum resultado correspondente encontrado {0}',
            countSelectedText: '{0} itens selecionados',
            maxOptionsText: ['Limite alcançado ({n} itens max)', 'Limite do grupo alcançado ({n} itens max)', ['itens',
                'item'
            ]],
            selectAllText: 'Selecionar Todos',
            deselectAllText: 'Desmarcar Todos',
            doneButtonText: 'Fechar',
            multipleSeparator: ', '
        };
        $('.selectpicker').selectpicker();

        const token = localStorage.getItem('token');

        if (token) {
            document.querySelector('[data-auth-nav]')?.style?.removeProperty('display');
        }
    </script>

    @stack('scripts')
</body>

</html>
