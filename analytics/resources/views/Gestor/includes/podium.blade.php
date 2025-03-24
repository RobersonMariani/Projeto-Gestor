<!-- Pódio dos Três Melhores Analistas -->
<div class="card mb-5">
    <div class="card-body">
        <div class="d-flex align-items-center mb-3">
            <div class="me-3 icon-container">
                <i class="fas fa-trophy fa-lg custom-icon"></i>
            </div>
            <h5 class="card-title m-0">Pódio - Melhores Analistas</h5>
        </div>

        <label for="analystSelectPodium" class="form-label">Selecione para não exibir:</label><br>
        <select id="analystSelectPodium" class="mb-4 selectpicker" multiple title="Selecione" {{-- data-style="btn-danger" --}}
            data-size="auto" data-selected-text-format="count > 3" data-actions-box="true">
            <!-- Opções de analistas serão carregadas dinamicamente -->
        </select>

        <div id="podiumContainer" class="d-flex justify-content-center podium-container">
            <!-- Pódio gerado dinamicamente -->
        </div>
    </div>
</div>

@push('styles')
    <style>
        .podium-container {
            display: flex;
            justify-content: center;
            align-items: flex-end;
        }

        .podium-step {
            text-align: center;
            margin: 0 10px;
            padding: 20px;
            background-color: #f8f9fa;
            border: 1px solid #ccc;
            border-radius: 12px;
            width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 150px;
            transition: transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .podium-step h3,
        .podium-step p {
            margin: 0;
            transition: color 0.3s ease, font-weight 0.3s ease, text-shadow 0.3s ease;
        }

        .podium-step h3 {
            font-size: 1.8rem;
            font-weight: bold;
        }

        .podium-step p {
            font-size: 1.2rem;
        }

        .podium-step:first-child {
            order: 2;
            background-color: #ffc107;
            /* transform: translateY(-30px); */
            height: 300px;
            animation: glow 3s infinite ease-in-out;
        }

        .podium-step:nth-child(2) {
            order: 1;
            background-color: #adb5bd;
            height: 260px;
        }

        .podium-step:nth-child(3) {
            order: 3;
            background-color: #cd7f32;
            height: 240px;
        }

        /* Efeito de Hover */
        .podium-step:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .podium-step:hover h3,
        .podium-step:hover p {
            color: #343a40;
            font-weight: bolder;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .podium-step:hover:first-child {
            transform: translateY(-40px) scale(1.1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        /* Efeito de Brilho no Primeiro Lugar */
        @keyframes glow {

            0%,
            100% {
                box-shadow: 0 0 20px rgba(255, 193, 7, 0.8), 0 0 40px rgba(255, 193, 7, 0.6), 0 0 60px rgba(255, 193, 7, 0.4);
                transform: translateY(-5px);
            }

            50% {
                box-shadow: 0 0 40px rgba(255, 193, 7, 1), 0 0 80px rgba(255, 193, 7, 0.8), 0 0 100px rgba(255, 193, 7, 0.6);
                transform: translateY(-30px);
            }
        }

        /* Efeitos de Escrita */
        .podium-step h3 {
            color: #212529;
        }

        .podium-step p {
            color: #6c757d;
        }

        .podium-step:hover h3 {
            color: #000;
        }

        .podium-step:hover p {
            color: #495057;
        }

        /* Sombras e efeitos */
        .podium-step:first-child {
            box-shadow: 0 4px 15px rgba(255, 193, 7, 0.5);
        }

        .podium-step:nth-child(2) {
            box-shadow: 0 4px 15px rgba(173, 181, 189, 0.5);
        }

        .podium-step:nth-child(3) {
            box-shadow: 0 4px 15px rgba(205, 127, 50, 0.5);
        }
    </style>
@endpush

@push('scripts')
    @vite('resources/js/podium.js')
@endpush
