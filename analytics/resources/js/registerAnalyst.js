import Auth from './auth';
if (!Auth.getToken('token')) {
    window.location.href = '/';
}
document.addEventListener('DOMContentLoaded', async function () {
    loadData()

    document.getElementById('registerAnalystForm').addEventListener('submit', function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        let data = {};

        formData.forEach((value, key) => {
            if (!data[key]) {
                data[key] = value;
            }
        });

        axios.post('/api/analysts', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                loadData()
                clearInput()
                alert('Analista cadastrado com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao sallet dados:', error);
                alert('Houve um problema ao cadastrar o analista.');
            });
    });

    const selectGestor = document.getElementById('selectGestor');
    const gestors = await getDataGestors()
    gestors.forEach(gestor => {
        const option = document.createElement('option');
        option.value = gestor.id;
        option.text = gestor.name;
        selectGestor.appendChild(option);
    });

    document.addEventListener('click', function (event) {
        if (event.target.closest('button[data-action="delete"]')) {
            const analystId = event.target.closest('button').getAttribute('data-id');
            $('#analyst-id').val(analystId);
            $('#confirmDelete').modal('show');
        }
    });
    document.getElementById('confirmDeleteButton').addEventListener('click', function () {
        const analystId = $('#analyst-id').val();
        if (analystId) {
            deleteAnalyst(analystId);
        }
    });

});

function clearInput(){
    document.getElementById('name').value = '';
    document.getElementById('selectGestor').value = '';
}

function deleteAnalyst(analystId) {
    axios.delete(`/api/analysts/${analystId}`, {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
        .then(response => {
            loadData()
            clearInput()
            alert('Analista excluído com sucesso!');
            $('#confirmDelete').modal('hide');
        })
        .catch(error => {
            console.error('Erro ao excluir Analista:', error);
            alert('Houve um problema ao excluir o Analista.');
        });
}

async function getDataGestors() {
    try {
        const response = await axios.get('/api/gestors');
        return response.data;
    } catch (error) {
        console.error('Erro ao carregar analistas:', error);
        return null; // Ou outro valor padrão para indicar que houve um erro
    }
}

function loadData(startDate = '') {
    // Destrua o DataTable se já foi inicializado
    if ($.fn.DataTable.isDataTable('#analysts')) {
        $('#analysts').DataTable().clear().destroy();
    }

    axios.get('/api/analysts', {
        params: {
            start_date: startDate
        }
    })
        .then(response => {
            const analysts = response.data;
            const tbody = document.getElementById('analysts-tbody');
            tbody.innerHTML = '';

            // Para cada analista, cria uma linha, mesmo que não tenha registros.
            analysts.forEach(analyst => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${analyst.name}</td>
                <td>${analyst.gestor.name}</td>
                <td>${formatDateTimePtBr(new Date(analyst.created_at))}</td>
                <td>
                    <button type="button" title="Excluir" class="btn btn-danger btn-sm" data-id="${analyst.id}" data-action="delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            });

            $('#analysts').DataTable(dataTableConfig);
        })
        .catch(error => {
            console.error('Erro ao carregar analysts:', error);
        });
}

// Função para formatar data e hora padrão pt-BR
function formatDateTimePtBr(data) {
    // Se a data for uma string no formato 'yyyy-mm-dd', extraia os componentes ano, mês e dia manualmente
    if (typeof data === 'string') {
        const [year, month, day] = data.split('-');
        data = new Date(year, month - 1, day); // Criar a data manualmente sem correção de fuso horário
    }

    // Verifica se o argumento é uma data válida
    if (!(data instanceof Date) || isNaN(data)) {
        return null; // Retorna null para valores inválidos
    }

    // Formata a data para o formato 'dd/mm/yyyy'
    const day = data.getDate().toString().padStart(2, '0');
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const year = data.getFullYear();

    // Formata a hora para o formato 'hh:mm:ss'
    const hours = data.getHours().toString().padStart(2, '0');
    const minutes = data.getMinutes().toString().padStart(2, '0');
    const seconds = data.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const dataTableConfig = {
    language: {
        "sEmptyTable": "Nenhum registro encontrado",
        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
        "sInfoFiltered": "(Filtrados de _MAX_ registros)",
        "sInfoPostFix": "",
        "sInfoThousands": ".",
        "sLengthMenu": "_MENU_ resultados por página",
        "sLoadingRecords": "Carregando...",
        "sProcessing": "Processando...",
        "sZeroRecords": "Nenhum registro encontrado",
        "sSearch": "Pesquisar",
        "oPaginate": {
            "sNext": "Próximo",
            "sPrevious": "Anterior",
            "sFirst": "Primeiro",
            "sLast": "Último"
        },
        "oAria": {
            "sSortAscending": ": Ordenar colunas de forma ascendente",
            "sSortDescending": ": Ordenar colunas de forma descendente"
        },
        "select": {
            "rows": {
                "_": "Selecionado %d linhas",
                "0": "Nenhuma linha selecionada",
                "1": "Selecionado 1 linha"
            }
        },
        "buttons": {
            "copy": "Copiar",
            "copyTitle": "Cópia bem-sucedida",
            "copySuccess": {
                "_": "%d linhas copiadas",
                "1": "1 linha copiada"
            }
        }
    },
    paging: false,
    searching: false,
    ordering: true,
    info: true,
    autoWidth: false,
    lengthChange: false
};
