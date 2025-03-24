import Auth from './auth';
if (!Auth.getToken('token')) {
    window.location.href = '/';
}
document.addEventListener('DOMContentLoaded', async function () {
    //Limitar input data para o dia de hoje
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const today = getToday();
    startDate.setAttribute('max', today);
    endDate.setAttribute('max', today);

    const filterButton = document.getElementById('filterButton');
    const filterSelectAnalyst = document.getElementById('filterSelectAnalyst');
    const filterSelectOcurrence = document.getElementById('filterSelectOcurrence');

    // Evento ao clicar no botão de filtro
    filterButton.addEventListener('click', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const filterSelectAnalyst = $('#filterSelectAnalyst').val();
        const filterSelectOcurrence = $('#filterSelectOcurrence').val();

        getData(startDate, endDate, filterSelectAnalyst, filterSelectOcurrence)
    });

    //Filtragem dinamica
    $('#filterSelectAnalyst, #filterSelectOcurrence').on('change', function () {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const filterSelectAnalyst = $('#filterSelectAnalyst').val();
        const filterSelectOcurrence = $('#filterSelectOcurrence').val();
        getData(startDate, endDate, filterSelectAnalyst, filterSelectOcurrence)
    })

    function getData(startDate = '', endDate = '', analyst_ids = [], occurrence_types = []) {
        axios.get('/api/records/reports/justifications', {
            params: {
                start_date: startDate,
                end_date: endDate,
                analyst_ids: analyst_ids,
                occurrence_types: occurrence_types
            }
        })
            .then(response => {
                const justifications = response.data;
                let table = $('#reports-tbody');

                // Limpa o conteúdo anterior
                table.empty();

                // Destrua o DataTable se já foi inicializado
                if ($.fn.DataTable.isDataTable('#reports')) {
                    $('#reports').DataTable().clear().destroy();
                }

                justifications.forEach(justification => {
                    let row = `
                    <tr>
                    <td>${formatDatePtBr(justification.record_date)}</td>
                    <td>${justification.analyst_name}</td>
                    <td>${translateFieldToPortuguese(justification.justification_field)}</td>
                    <td class="limited-width">${justification.justification_text}</td>
                    </tr>
                    `;
                    table.append(row);
                });
                $('#reports').DataTable(dataTableConfig);
            })
            .catch(error => {
                console.error('Erro ao carregar Justificativas:', error);
            });
    }
    getData()

    const analysts = await getDataAnalysts()
    analysts.forEach(analyst => {
        const option = document.createElement('option');
        option.value = analyst.id;
        option.text = analyst.name;
        filterSelectAnalyst.appendChild(option);
    });

    const ocurrences = {
        'late': 'Atrasos',
        'absenteeism': 'Absenteísmo',
        'return_emails': 'Retorno de E-mails',
        'errors_ctes': 'Erros Ct-es',
        'failure_send_occurrences': 'Falha no Envio de Ocorrências',
        'fleet_documentation_failure': 'Falha na Documentação da Frota'
    };
    for (const [key, value] of Object.entries(ocurrences)) {
        const option = document.createElement('option');
        option.value = key;
        option.text = value;
        filterSelectOcurrence.appendChild(option);
    }

    $('.selectpicker').selectpicker('refresh');
});

async function getDataAnalysts() {
    try {
        const response = await axios.get('/api/analysts');
        return response.data;
    } catch (error) {
        console.error('Erro ao carregar analistas:', error);
        return null; // Ou outro valor padrão para indicar que houve um erro
    }
}

function translateFieldToPortuguese(field) {
    const translations = {
        'late': 'Atrasos',
        'absenteeism': 'Absenteísmo',
        'return_emails': 'Retorno de E-mails',
        'errors_ctes': 'Erros Ct-es',
        'failure_send_occurrences': 'Falha no Envio de Ocorrências',
        'fleet_documentation_failure': 'Falha na Documentação da Frota'
    };

    return translations[field] || field; // Retorna a tradução ou o valor original se não encontrar
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
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    lengthChange: true,
    // Adiciona botões ao DataTable
    dom: '<"row"<"col-sm-4"l><"col-sm-4"B><"col-sm-4"f>>' + // LengthChange e Search em cima
        'rt' +  // Tabela
        'ip',  // Informação e Paginação embaixo
    buttons: [
        {
            extend: 'pdfHtml5',
            text: 'Exportar PDF',
            title: 'Relatório de Ocorrências',
            orientation: 'landscape', // Ajusta a orientação da página (pode ser 'portrait' ou 'landscape')
            pageSize: 'A4', // Define o tamanho da página
            exportOptions: {
                columns: ':visible' // Exporta apenas as colunas visíveis
            },
            customize: function (doc) {
                // Ajusta a margem, fonte, etc.
                doc.styles.title = {
                    alignment: 'center', // Centraliza o título
                    fontSize: 16,
                    bold: true,
                };
                doc.defaultStyle.alignment = 'left'; // Centraliza todo o conteúdo da tabela

                // Ajusta o alinhamento dos títulos das colunas
                doc.styles.tableHeader = {
                    alignment: 'left',
                    bold: true,
                    fontSize: 12,
                    fillColor: '#bf3137',
                    color: '#ffffff',
                    border: '1px solid black'
                };

                doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split(''); // Ajusta a largura das colunas
            }
        },
        'copy', 'csv', 'excel', 'print'
    ]
};

// Função para pegar data atual
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() retorna o mês de 0 a 11
    const day = String(today.getDate()).padStart(2, '0'); // getDate() retorna o dia do mês

    return `${year}-${month}-${day}`;
}

// Função para formatar data padrão pt-BR
function formatDatePtBr(data) {
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

    return `${day}/${month}/${year}`;
}

