import Auth from './auth';
if (!Auth.getToken('token')) {
    window.location.href = '/';
}
document.addEventListener('DOMContentLoaded', function () {

    //Limitar input data para o dia de hoje
    const startDateInput = document.getElementById('startDate');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('max', today);

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
                    const latestRecord = analyst.records.length > 0 ? analyst.records[0] : null;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${startDate ? startDate.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR')}</td>
                    <td>
                        <input type="hidden" name="analyst_id[]" value="${analyst.id}">
                        ${analyst.name}
                    </td>
                    <td>
                        <input type="number" name="late[]" class="form-control" step="1" value="${latestRecord ? latestRecord.late : ''}" id="late-${analyst.id}">
                        <button type="button" title="Adicionar Justificativa" class="btn btn-info btn-sm mt-1 ${(latestRecord && latestRecord.late > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#justificationModal" data-analyst-id="${analyst.id}" data-analyst-name="${analyst.name}" data-field="late" data-record-id="${latestRecord ? latestRecord.id : ''}" id="btn-late-${analyst.id}">
                            <i class="fas fa-file-signature"></i>
                        </button>
                        <button type="button" title="Ver Justificativa" class="btn btn-success btn-sm mt-1 ${(latestRecord && latestRecord.late > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#viewJustificationsModal" data-field="late" data-record-id="${latestRecord ? latestRecord.id : ''}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <input type="number" name="absenteeism[]" class="form-control" step="1" value="${latestRecord ? latestRecord.absenteeism : ''}" id="absenteeism-${analyst.id}">
                        <button type="button" title="Adicionar Justificativa" class="btn btn-info btn-sm mt-1 ${(latestRecord && latestRecord.absenteeism > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#justificationModal" data-analyst-id="${analyst.id}" data-analyst-name="${analyst.name}" data-field="absenteeism" data-record-id="${latestRecord ? latestRecord.id : ''}" id="btn-absenteeism-${analyst.id}">
                            <i class="fas fa-file-signature"></i>
                        </button>
                        <button type="button" title="Ver Justificativa" class="btn btn-success btn-sm mt-1 ${(latestRecord && latestRecord.absenteeism > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#viewJustificationsModal" data-field="absenteeism" data-record-id="${latestRecord ? latestRecord.id : ''}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <input type="number" name="return_emails[]" class="form-control" step="1" value="${latestRecord ? latestRecord.return_emails : ''}" id="return_emails-${analyst.id}">
                        <button type="button" title="Adicionar Justificativa" class="btn btn-info btn-sm mt-1 ${(latestRecord && latestRecord.return_emails > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#justificationModal" data-analyst-id="${analyst.id}" data-analyst-name="${analyst.name}" data-field="return_emails" data-record-id="${latestRecord ? latestRecord.id : ''}" id="btn-return_emails-${analyst.id}">
                            <i class="fas fa-file-signature"></i>
                        </button>
                        <button type="button" title="Ver Justificativa" class="btn btn-success btn-sm mt-1 ${(latestRecord && latestRecord.return_emails > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#viewJustificationsModal" data-field="return_emails" data-record-id="${latestRecord ? latestRecord.id : ''}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <input type="number" name="errors_ctes[]" class="form-control" step="1" value="${latestRecord ? latestRecord.errors_ctes : ''}" id="errors_ctes-${analyst.id}">
                        <button type="button" title="Adicionar Justificativa" class="btn btn-info btn-sm mt-1 ${(latestRecord && latestRecord.errors_ctes > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#justificationModal" data-analyst-id="${analyst.id}" data-analyst-name="${analyst.name}" data-field="errors_ctes" data-record-id="${latestRecord ? latestRecord.id : ''}" id="btn-errors_ctes-${analyst.id}">
                            <i class="fas fa-file-signature"></i>
                        </button>
                        <button type="button" title="Ver Justificativa" class="btn btn-success btn-sm mt-1 ${(latestRecord && latestRecord.errors_ctes > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#viewJustificationsModal" data-field="errors_ctes" data-record-id="${latestRecord ? latestRecord.id : ''}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <input type="number" name="failure_send_occurrences[]" class="form-control" step="1" value="${latestRecord ? latestRecord.failure_send_occurrences : ''}" id="failure_send_occurrences-${analyst.id}">
                        <button type="button" title="Adicionar Justificativa" class="btn btn-info btn-sm mt-1 ${(latestRecord && latestRecord.failure_send_occurrences > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#justificationModal" data-analyst-id="${analyst.id}" data-analyst-name="${analyst.name}" data-field="failure_send_occurrences" data-record-id="${latestRecord ? latestRecord.id : ''}" id="btn-failure_send_occurrences-${analyst.id}">
                            <i class="fas fa-file-signature"></i>
                        </button>
                        <button type="button" title="Ver Justificativa" class="btn btn-success btn-sm mt-1 ${(latestRecord && latestRecord.failure_send_occurrences > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#viewJustificationsModal" data-field="failure_send_occurrences" data-record-id="${latestRecord ? latestRecord.id : ''}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                    <td>
                        <input type="number" name="fleet_documentation_failure[]" class="form-control" step="1" value="${latestRecord ? latestRecord.fleet_documentation_failure : ''}" id="fleet_documentation_failure-${analyst.id}">
                        <button type="button" title="Adicionar Justificativa" class="btn btn-info btn-sm mt-1 ${(latestRecord && latestRecord.fleet_documentation_failure > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#justificationModal" data-analyst-id="${analyst.id}" data-analyst-name="${analyst.name}" data-field="fleet_documentation_failure" data-record-id="${latestRecord ? latestRecord.id : ''}" id="btn-fleet_documentation_failure-${analyst.id}">
                            <i class="fas fa-file-signature"></i>
                        </button>
                        <button type="button" title="Ver Justificativa" class="btn btn-success btn-sm mt-1 ${(latestRecord && latestRecord.fleet_documentation_failure > 0) ? '' : 'disabled'}" data-bs-toggle="modal" data-bs-target="#viewJustificationsModal" data-field="fleet_documentation_failure" data-record-id="${latestRecord ? latestRecord.id : ''}">
                            <i class="fas fa-eye"></i>
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

    // Carrega os dados quando a página é carregada
    loadData();

    // Filtro de data
    document.getElementById('filterButton').addEventListener('click', function () {
        const startDate = document.getElementById('startDate').value;
        loadData(startDate);
    });
});

function setupInputListener(inputId, buttonId) {
    const inputElement = document.getElementById(inputId);
    const buttonElement = document.getElementById(buttonId);

    inputElement.addEventListener('input', function () {
        if (parseFloat(inputElement.value) > 0) {
            buttonElement.classList.remove('disabled');
        } else {
            buttonElement.classList.add('disabled');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Função para abrir o modal com os dados corretos
    $('#justificationModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget);
        let justificationId = button.data('justification-id')
        let analystId = button.data('analyst-id');
        let analystName = button.data('analyst-name');
        let field = button.data('field');
        let recordId = button.data('record-id');

        let modal = $(this);

        if (justificationId) {
            // Modo de edição
            axios.get(`/api/justifications/${justificationId}`)
                .then(response => {
                    const justification = response.data;
                    modal.find('.modal-title').text('Editar Justificativa');
                    modal.find('#justification_id').val(justificationId);
                    //modal.find('#analyst_id').val(justification.analyst_id);
                    modal.find('#field').val(justification.field);
                    modal.find('#record-id').val(justification.record_id);
                    modal.find('#justification-text').val(justification.justification);
                })
                .catch(error => {
                    console.error('Erro ao carregar a justificativa:', error);
                });
        } else {
            modal.find('.modal-title').html(`Adicionar Justificativa para ${translateFieldToPortuguese(field)} <br> <strong>Analista ${analystName}</strong>`);
            modal.find('#analyst_id').val(analystId);
            modal.find('#field').val(field);
            modal.find('#record-id').val(recordId);
        }
    });

    // Função para salvar a justificativa
    $('#save-justification').on('click', function () {
        let formData = new FormData($('#justification-form')[0]);
        let justificationId = document.getElementById('justification_id').value;

        let url = '/api/justifications';
        let method = 'post';

        if (justificationId) {
            url += `/${justificationId}`;
            formData.append('_method', 'PUT');  // ou 'patch', dependendo do método REST que você usa
        }
        console.log(url, method)
        axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
            .then(response => {
                alert('Justificativa salva com sucesso!');
                $('#justificationModal').modal('hide');
                clearJustificationModal();
            })
            .catch(error => {
                console.error('Erro ao salvar justificativa:', error);
                alert('Houve um problema ao salvar a justificativa.');
            });
    });

    // Chamada Modal para visualização de justificativas
    $('#viewJustificationsModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget);
        let field = button.data('field');
        let recordId = button.data('record-id');

        let modal = $(this);
        let justificationsTableBody = modal.find('#justifications-table-body');

        // Limpa o conteúdo anterior
        justificationsTableBody.empty();

        // Destrua o DataTable se já foi inicializado
        if ($.fn.DataTable.isDataTable('#justifications-view')) {
            $('#justifications-view').DataTable().clear().destroy();
        }

        // Faz uma requisição AJAX para carregar as justificativas
        axios.get(`/api/justifications/${recordId}/${field}`)
            .then(response => {
                const justifications = response.data;
                if (justifications.length > 0) {
                    justifications.forEach(justification => {
                        let row = `
                            <tr>
                                <td>${new Date(justification.created_at).toLocaleDateString('pt-BR')}</td>
                                <td >${justification.justification}</td>
                                <td>${justification.file_path ? `<a title="VER" class="btn btn-secondary" href="/storage/${justification.file_path}" target="_blank"><i class="fa-solid fa-magnifying-glass"></i></a>` : ''}</td>
                                <td>
                                    <button type="button" title="Editar" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#justificationModal"data-justification-id="${justification.id}" data-field="${justification.field}" data-record-id="${justification.record_id}" data-action="edit">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button type="button" title="Excluir" class="btn btn-danger btn-sm" data-id="${justification.id}" data-action="delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        justificationsTableBody.append(row);
                    });

                    $('#justifications-view').DataTable(dataTableConfig);
                } else {
                    justificationsTableBody.append('<tr><td colspan="4" class="text-center">Nenhuma justificativa encontrada.</td></tr>');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar justificativas:', error);
                justificationsTableBody.append('<tr><td colspan="3" class="text-center">Erro ao carregar justificativas.</td></tr>');
            });
    });

    document.addEventListener('click', function (event) {
        if (event.target.closest('button[data-action="delete"]')) {
            const justificationId = event.target.closest('button').getAttribute('data-id');
            $('#justification-id').val(justificationId);
            $('#confirmDeleteModal').modal('show');
        }
    });
    document.getElementById('confirmDeleteButton').addEventListener('click', function () {
        const justificationId = $('#justification-id').val();
        if (justificationId) {
            deleteJustification(justificationId);
        }
    });

    function deleteJustification(justificationId) {
        axios.delete(`/api/justifications/${justificationId}`, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
            .then(response => {
                alert('Justificativa excluída com sucesso!');
                $('#confirmDeleteModal').modal('hide');
                $('#viewJustificationsModal').modal('hide');
            })
            .catch(error => {
                console.error('Erro ao excluir justificativa:', error);
                alert('Houve um problema ao excluir a justificativa.');
            });
    }
});

function clearJustificationModal() {
    document.getElementById('justification-form').reset(); // Limpa todos os campos do formulário
    $('#analyst_id').val(''); // Limpa o campo hidden 'analyst_id'
    $('#field').val(''); // Limpa o campo hidden 'field'
    $('#justification-text').val(''); // Limpa o campo de texto da justificativa
    $('#justification-file').val(''); // Limpa o campo de arquivo
}

document.getElementById('record-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    let data = {};

    formData.forEach((value, key) => {
        if (!data[key]) {
            data[key] = [];
        }
        data[key].push(value);
    });

    // Captura a data selecionada no filtro
    const selectedDate = document.getElementById('startDate').value || new Date().toISOString().split('T')[0];
    data['date'] = selectedDate; // Adiciona a data ao objeto `data`

    axios.post('/api/records', data, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        }
    })
        .then(response => {
            alert('Dados salvos com sucesso!');

            const recordIds = response.data.recordIds;
            // Atualiza os botões com os novos recordIds
            for (const analystId in recordIds) {
                const newRecordId = recordIds[analystId];
                const fields = ['late', 'absenteeism', 'return_emails', 'errors_ctes', 'failure_send_occurrences', 'fleet_documentation_failure'];

                fields.forEach(field => {
                    let penButton = document.querySelector(`#btn-${field}-${analystId}`);
                    let eyeButton = penButton.nextElementSibling;

                    // Atualiza os data-record-id com o novo ID
                    penButton.setAttribute('data-record-id', newRecordId);
                    eyeButton.setAttribute('data-record-id', newRecordId);
                });
            }

            // Atualiza o estado dos botões após salvar os dados
            updateAllJustifyButtons();
        })
        .catch(error => {
            console.error('Erro ao sallet dados:', error);
            alert('Houve um problema ao sallet os dados.');
        });
});

function updateAllJustifyButtons() {
    const fields = [
        'late',
        'absenteeism',
        'return_emails',
        'errors_ctes',
        'failure_send_occurrences',
        'fleet_documentation_failure'
    ];

    fields.forEach(field => {
        const inputs = document.querySelectorAll(`input[name="${field}[]"]`);
        inputs.forEach(input => {
            const value = parseFloat(input.value);
            const button = document.getElementById(`btn-${field}-${input.id.split('-')[1]}`);
            const eyeButton = button.nextElementSibling;

            if (value > 0) {
                button.classList.remove('disabled');
                eyeButton.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
                eyeButton.classList.add('disabled');
            }
        });
    });
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

const dataTableConfigs = {
    language: {
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/Portuguese-Brasil.json'
    },
    dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
        '<"row"<"col-sm-12"tr>>' +
        '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
    buttons: [
        {
            extend: 'copy',
            className: 'btn btn-primary'
        },
        {
            extend: 'csv',
            className: 'btn btn-success'
        },
        {
            extend: 'excel',
            className: 'btn btn-info'
        }
    ],
    initComplete: function () {
        $('.dt-button').removeClass('dt-button');
    }
};

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
