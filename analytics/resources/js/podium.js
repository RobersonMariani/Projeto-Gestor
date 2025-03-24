import Auth from './auth';
if (!Auth.getToken('token')) {
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', function () {
    // Evento ao clicar no botão de filtro
    filterButton.addEventListener('click', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        const savedAnalysts = JSON.parse(localStorage.getItem('analystSelectPodium')) || []

        loadPodium(startDate, endDate, savedAnalysts);
    });

    // Carregar os três melhores analistas
    function loadPodium(startDate = '', endDate = '', analystIds = []) {
        axios.get('/api/records/podium/top-analysts', {
            params: { start_date: startDate, end_date: endDate, analyst_ids: analystIds }
        })
            .then(response => {
                const topAnalysts = response.data;
                const podiumContainer = document.getElementById('podiumContainer');
                podiumContainer.innerHTML = '';

                if (topAnalysts && topAnalysts.length > 0) {
                    topAnalysts.forEach((analyst, index) => {
                        const podiumStep = document.createElement('div');
                        podiumStep.className = `podium-step ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`;
                        podiumStep.innerHTML = `
                        <h3>${index + 1}º</h3>
                        <p>${analyst.analyst?.name}</p>
                        <p>Ocorrências Registradas: ${analyst.total_occurrences}</p>
                    `;
                        podiumContainer.appendChild(podiumStep);
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar o pódio:', error);
            });
    }

    // Chamar a função quando a página carregar e após os filtros
    //loadPodium();

    const analystSelectPodium = document.getElementById('analystSelectPodium');

    analystSelectPodium.addEventListener('change', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const analystIds = $('#analystSelectPodium').val();
        saveAnalysts();
        loadPodium(startDate, endDate, analystIds);
    });

    // Carrega os analistas na seleção
    axios.get('/api/analysts')
        .then(response => {
            const analysts = response.data;
            analysts.forEach(analyst => {
                const option = document.createElement('option');
                option.value = analyst.id;
                option.text = analyst.name;
                analystSelectPodium.appendChild(option);
            });
            // Atualiza o Bootstrap Select após adicionar as opções
            $('#analystSelectPodium').selectpicker('refresh');
            loadSavedAnalysts();
        })
        .catch(error => {
            console.error('Erro ao carregar analistas:', error);
        });

    function loadSavedAnalysts() {
        const savedAnalysts = JSON.parse(localStorage.getItem('analystSelectPodium')) || [];
        $('#analystSelectPodium').selectpicker('val', savedAnalysts)
        loadPodium('', '', savedAnalysts);
    }

    // Função para salvar analistas selecionados no localStorage
    function saveAnalysts() {
        const selectedAnalysts = $('#analystSelectPodium').val();
        localStorage.setItem('analystSelectPodium', JSON.stringify(selectedAnalysts));
    }
});
