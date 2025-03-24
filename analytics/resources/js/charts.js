import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Auth from './auth';

Chart.register(...registerables);
Chart.register(annotationPlugin, ChartDataLabels);

if (!Auth.getToken('token')) {
    window.location.href = '/';
}

document.addEventListener('DOMContentLoaded', function () {
    //Limitar input data para o dia de hoje
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const today = getToday();
    startDateInput.setAttribute('max', today);
    endDateInput.setAttribute('max', today);

    let generalChartInstance = null;

    const generalChartCtx = document.getElementById('generalChart').getContext('2d');
    const filterButton = document.getElementById('filterButton');
    const analystSelect = document.getElementById('analystSelect');
    const analystChartsContainer = document.getElementById('analystChartsContainer');

    loadGeneralChart(generalChartCtx, today, endDateInput.value);

    // Evento ao clicar no botão de filtro
    filterButton.addEventListener('click', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const chartType = document.getElementById('chartType').value;
        const analystIds = $('#analystSelect').val();

        if (chartType === 'day') {
            loadGeneralChartWithDifferenceDay(generalChartCtx, startDate, endDate);
        } else if (chartType === 'month') {
            loadGeneralChartByMonth(generalChartCtx, startDate, endDate);
        } else {
            loadGeneralChart(generalChartCtx, startDate, endDate);
        }

        loadAnalystCharts(analystIds, startDate, endDate, chartType);

        /*  const analystId = analystSelect.value;
         const analystName = analystSelect.options[analystSelect.selectedIndex].text; */

        /*  if (analystId === 'all') {
             if (chartType === 'day') {
                 loadAnalystChartWithDifferenceDay(startDate, endDate)
             } else if (chartType === 'month') {
                 loadAnalytChartByMonth(startDate, endDate)
             } else {
                 loadAllAnalystCharts(startDate, endDate)
             }
         } else {
             if (chartType === 'day') {
                 loadSingleAnalystChartWithDifferenceDay(analystId, analystName, startDate, endDate)
             } else if (chartType === 'month') {
                 loadSingleAnalytChartByMonth(analystId, analystName, startDate, endDate)
             } else {
                 loadSingleAnalystChart(analystId, analystName, startDate, endDate);
             }
         } */

    });

    $('#chartType').on('change', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const chartType = document.getElementById('chartType').value;
        const analystIds = $('#analystSelect').val();

        if (chartType === 'day') {
            loadGeneralChartWithDifferenceDay(generalChartCtx, startDate, endDate);
        } else if (chartType === 'month') {
            loadGeneralChartByMonth(generalChartCtx, startDate, endDate);
        } else {
            loadGeneralChart(generalChartCtx, startDate, endDate);
        }

        loadAnalystCharts(analystIds, startDate, endDate, chartType);

        /* const analystId = analystSelect.value;
        const analystName = analystSelect.options[analystSelect.selectedIndex].text;

        if (analystId === 'all') {
            if (chartType === 'day') {
                loadAnalystChartWithDifferenceDay(startDate, endDate)
            } else if (chartType === 'month') {
                loadAnalytChartByMonth(startDate, endDate)
            } else {
                loadAllAnalystCharts(startDate, endDate)
            }
        } else {
            if (chartType === 'day') {
                loadSingleAnalystChartWithDifferenceDay(analystId, analystName, startDate, endDate)
            } else if (chartType === 'month') {
                loadSingleAnalytChartByMonth(analystId, analystName, startDate, endDate)
            } else {
                loadSingleAnalystChart(analystId, analystName, startDate, endDate);
            }
        } */
    })

    // Evento ao mudar o analista no select
    analystSelect.addEventListener('change', function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const chartType = document.getElementById('chartType').value;
        const analystIds = $('#analystSelect').val();
        loadAnalystCharts(analystIds, startDate, endDate, chartType);

        /*
                const analystId = this.value;
                const analystName = this.selectedOptions[0].text

                if (analystId === 'all') {
                    if (chartType === 'day') {
                        loadAnalystChartWithDifferenceDay(startDate, endDate)
                    } else if (chartType === 'month') {
                        loadAnalytChartByMonth(startDate, endDate)
                    } else {
                        loadAllAnalystCharts(startDate, endDate)
                    }
                } else {
                    if (chartType === 'day') {
                        loadSingleAnalystChartWithDifferenceDay(analystId, analystName, startDate, endDate)
                    } else if (chartType === 'month') {
                        loadSingleAnalytChartByMonth(analystId, analystName, startDate, endDate)
                    } else {
                        loadSingleAnalystChart(analystId, analystName, startDate, endDate);
                    }
                } */
    });

    // ----------------- Começo Funções de gráfico para Geral ----------------- //
    function loadGeneralChart(ctx, startDate = '', endDate = '') {
        if (generalChartInstance) {
            generalChartInstance.destroy();
        }

        axios.get('/api/records/general/all', {
            params: { start_date: startDate, end_date: endDate }
        })
            .then(response => {
                const data = response.data;

                const chartTitle = startDate && endDate ? `Desempenho de ${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}` : 'Desempenho Geral';

                generalChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Atrasos', 'Absenteísmo', 'Retorno E-mails', 'Erros Ct-es', 'Falha Envio Ocorrências', 'Falha Documentação Frota'],
                        datasets: [{
                            label: 'Ocorrências',
                            data: [data.late, data.absenteeism, data.return_emails, data.errors_ctes, data.failure_send_occurrences, data.fleet_documentation_failure],
                            backgroundColor: [
                                'rgba(191, 49, 55, 0.9)',
                            ],
                            borderColor: [
                                'rgba(0, 0, 0, 0.9)',
                            ],
                            borderWidth: 1,
                            //barThickness: 20,  // Espessura fixa para as barras
                            maxBarThickness: 70,
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                position: 'bottom',
                                text: chartTitle
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#000',
                                font: {
                                    weight: 'bold'
                                },
                                formatter: function (value, context) {
                                    return value;
                                }
                            }
                        }
                    }
                });
            });
    }

    function loadGeneralChartWithDifferenceDay(ctx, startDate = '', endDate = '') {
        if (generalChartInstance) {
            generalChartInstance.destroy();
        }

        axios.get('/api/records/general/all', {
            params: { start_date: startDate, end_date: endDate, type: 'day' }
        })
            .then(response => {
                const data = response.data;

                const labels = data.map(record => formatDatePtBr(record.date));  // Extraí as datas para os rótulos
                const lateData = data.map(record => record.late);
                const absenteeismData = data.map(record => record.absenteeism);
                const returnEmailsData = data.map(record => record.return_emails);
                const errorsCtesData = data.map(record => record.errors_ctes);
                const failureSendOccurrencesData = data.map(record => record.failure_send_occurrences);
                const fleetDocumentationFailureData = data.map(record => record.fleet_documentation_failure);

                const chartTitle = startDate && endDate ? `Desempenho de ${startDate} a ${endDate}` : 'Desempenho Geral';

                generalChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Atrasos',
                                data: lateData,
                                backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Absenteísmo',
                                data: absenteeismData,
                                backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Retorno E-mails',
                                data: returnEmailsData,
                                backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Erros Ct-es',
                                data: errorsCtesData,
                                backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Falha Envio Ocorrências',
                                data: failureSendOccurrencesData,
                                backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Falha Documentação Frota',
                                data: fleetDocumentationFailureData,
                                backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            }
                        ]
                    },
                    options: {
                        layout: {
                            padding: {
                                top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                position: 'bottom',
                                text: `Desempenho de ${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}`
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#000',
                                font: {
                                    weight: 'bold'
                                },
                                formatter: function (value, context) {
                                    return value;
                                }
                            }
                        }
                    }
                });
            });
    }

    function loadGeneralChartByMonth(ctx, startDate = '', endDate = '') {
        if (generalChartInstance) {
            generalChartInstance.destroy();
        }

        axios.get('/api/records/general/all', {
            params: { start_date: startDate, end_date: endDate, type: 'month' }
        })
            .then(response => {
                const data = response.data;

                const labels = data.map(record => `${record.month}/${record.year}`);  // Labels formatados por mês/ano
                const lateData = data.map(record => record.late);
                const absenteeismData = data.map(record => record.absenteeism);
                const returnEmailsData = data.map(record => record.return_emails);
                const errorsCtesData = data.map(record => record.errors_ctes);
                const failureSendOccurrencesData = data.map(record => record.failure_send_occurrences);
                const fleetDocumentationFailureData = data.map(record => record.fleet_documentation_failure);

                generalChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            // As configurações dos datasets, como backgroundColor e borderWidth, permanecem as mesmas.
                            {
                                label: 'Atrasos',
                                data: lateData,
                                backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Absenteísmo',
                                data: absenteeismData,
                                backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Retorno E-mails',
                                data: returnEmailsData,
                                backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Erros Ct-es',
                                data: errorsCtesData,
                                backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Falha Envio Ocorrências',
                                data: failureSendOccurrencesData,
                                backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            },
                            {
                                label: 'Falha Documentação Frota',
                                data: fleetDocumentationFailureData,
                                backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                borderColor: 'rgba(0, 0, 0, 0.9)',
                                borderWidth: 1,
                                maxBarThickness: 70,
                            }
                        ]
                    },
                    options: {
                        layout: {
                            padding: {
                                top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                            }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                            title: {
                                display: true,
                                position: 'bottom',
                                text: `Total por Mês de ${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}`
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end',
                                color: '#000',
                                font: { weight: 'bold' },
                                formatter: function (value) { return value; }
                            }
                        }
                    }
                });
            });
    }
    // ----------------- Fim Funções de gráfico para Geral ----------------- //

    // ----------------- Começo Funções de gráfico para todos os analistas ----------------- //
    function loadAnalystCharts(analystIds = [], startDate = '', endDate = '', chartType = 'total') {

        // Limpa os gráficos anteriores
        analystChartsContainer.innerHTML = '';
        analystChartsContainer.className = `row row-cols-1 row-cols-md-${chartType === 'day' ? '1' : '2'}`; // Define layout para dois gráficos por linha

        // Garante que analistas sejam selecionados
        if (analystIds.length === 0) {
            console.error('Nenhum analista selecionado.');
            return;
        }

        if (chartType === 'total') {
            loadAnalystChartsTotal(analystIds, startDate, endDate);
            return;
        }

        // Faz a requisição para os dados dos analistas selecionados
        axios.get('/api/records/general/analyst', {
            params: {
                analyst_ids: analystIds,  // Lista de analistas
                start_date: startDate,
                end_date: endDate,
                type: chartType
            }
        })
            .then(response => {
                const analysts = response.data;

                if (analysts && analysts.length > 0) {
                    const groupedData = {};

                    // Agrupar os registros por analista
                    analysts.forEach(record => {
                        const analystId = record.analyst_id;
                        if (!groupedData[analystId]) {
                            groupedData[analystId] = {
                                analystName: record.analyst.name,
                                labels: [],
                                lateData: [],
                                absenteeismData: [],
                                returnEmailsData: [],
                                errorsCtesData: [],
                                failureSendOccurrencesData: [],
                                fleetDocumentationFailureData: []
                            };
                        }

                        // Agrupa os dados por analista
                        if (chartType === 'day') {
                            groupedData[analystId].labels.push(formatDatePtBr(record.date));
                        } else if (chartType === 'month') {
                            groupedData[analystId].labels.push(`${record.month}/${record.year}`);
                        }

                        groupedData[analystId].lateData.push(record.late);
                        groupedData[analystId].absenteeismData.push(record.absenteeism);
                        groupedData[analystId].returnEmailsData.push(record.return_emails);
                        groupedData[analystId].errorsCtesData.push(record.errors_ctes);
                        groupedData[analystId].failureSendOccurrencesData.push(record.failure_send_occurrences);
                        groupedData[analystId].fleetDocumentationFailureData.push(record.fleet_documentation_failure);
                    });

                    // Cria um gráfico para cada analista
                    Object.values(groupedData).forEach(analyst => {
                        const chartContainer = document.createElement('div');
                        chartContainer.className = 'col mb-4'; // Define colunas responsivas
                        const canvas = document.createElement('canvas');
                        canvas.width = 400;
                        canvas.height = 200;
                        chartContainer.appendChild(canvas);
                        analystChartsContainer.appendChild(chartContainer);

                        new Chart(canvas.getContext('2d'), {
                            type: 'bar',
                            data: {
                                labels: analyst.labels,
                                datasets: [
                                    {
                                        label: 'Atrasos',
                                        data: analyst.lateData,
                                        backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                        borderColor: 'rgba(0, 0, 0, 0.9)',
                                        borderWidth: 1,
                                        maxBarThickness: 50
                                    },
                                    {
                                        label: 'Absenteísmo',
                                        data: analyst.absenteeismData,
                                        backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                        borderColor: 'rgba(0, 0, 0, 0.9)',
                                        borderWidth: 1,
                                        maxBarThickness: 50
                                    },
                                    {
                                        label: 'Retorno E-mails',
                                        data: analyst.returnEmailsData,
                                        backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                        borderColor: 'rgba(0, 0, 0, 0.9)',
                                        borderWidth: 1,
                                        maxBarThickness: 50
                                    },
                                    {
                                        label: 'Erros Ct-es',
                                        data: analyst.errorsCtesData,
                                        backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                        borderColor: 'rgba(0, 0, 0, 0.9)',
                                        borderWidth: 1,
                                        maxBarThickness: 50
                                    },
                                    {
                                        label: 'Falha Envio Ocorrências',
                                        data: analyst.failureSendOccurrencesData,
                                        backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                        borderColor: 'rgba(0, 0, 0, 0.9)',
                                        borderWidth: 1,
                                        maxBarThickness: 50
                                    },
                                    {
                                        label: 'Falha Documentação Frota',
                                        data: analyst.fleetDocumentationFailureData,
                                        backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                        borderColor: 'rgba(0, 0, 0, 0.9)',
                                        borderWidth: 1,
                                        maxBarThickness: 50
                                    }
                                ]
                            },
                            options: {
                                layout: {
                                    padding: {
                                        top: 30,
                                        bottom: 30
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'bottom',
                                    },
                                    title: {
                                        display: true,
                                        position: 'bottom',
                                        text: analyst.analystName
                                    },
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'end',
                                        color: '#000',
                                        font: {
                                            weight: 'bold'
                                        },
                                        formatter: (value) => value
                                    }
                                }
                            }
                        });
                    });
                } else {
                    console.error('Nenhum dado de analista disponível.');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a lista de analistas:', error);
            });
    }

    function loadAnalystChartsTotal(analystIds = [], startDate = '', endDate = '', chartType = 'total') {
        // Limpa os gráficos anteriores
        analystChartsContainer.innerHTML = '';
        analystChartsContainer.className = 'row row-cols-1 row-cols-md-2'; // Define layout para dois gráficos por linha

        // Garante que analistas sejam selecionados
        if (analystIds.length === 0) {
            console.error('Nenhum analista selecionado.');
            return;
        }

        // Faz a requisição para os dados dos analistas selecionados
        axios.get('/api/records/general/analyst', {
            params: {
                analyst_ids: analystIds,  // Lista de analistas
                start_date: startDate,
                end_date: endDate,
                type: chartType
            }
        })
            .then(response => {
                const analysts = response.data;

                if (analysts && analysts.length > 0) {
                    // Itera sobre os dados de cada analista e cria gráficos individuais
                    analysts.forEach(analyst => {
                        const chartContainer = document.createElement('div');
                        chartContainer.className = 'col mb-4'; // Define colunas responsivas
                        const canvas = document.createElement('canvas');
                        canvas.width = 400;
                        canvas.height = 200;
                        chartContainer.appendChild(canvas);
                        analystChartsContainer.appendChild(chartContainer);

                        const analystName = analyst.analyst.name;
                        const data = [analyst.late, analyst.absenteeism, analyst.return_emails, analyst.errors_ctes, analyst.failure_send_occurrences, analyst.fleet_documentation_failure];

                        new Chart(canvas.getContext('2d'), {
                            type: 'bar',
                            data: {
                                labels: ['Atrasos', 'Absenteísmo', 'Retorno E-mails', 'Erros Ct-es', 'Falha Envio Ocorrências', 'Falha Documentação Frota'],
                                datasets: [{
                                    label: `Ocorrências de ${analystName}`,
                                    data: data,
                                    backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                    borderColor: 'rgba(0, 0, 0, 0.9)',
                                    borderWidth: 1,
                                    maxBarThickness: 50
                                }]
                            },
                            options: {
                                layout: {
                                    padding: {
                                        top: 30,
                                        bottom: 30
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'bottom',
                                    },
                                    title: {
                                        display: true,
                                        position: 'bottom',
                                        text: `Desempenho Total de ${analystName}`
                                    },
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'end',
                                        color: '#000',
                                        font: {
                                            weight: 'bold'
                                        },
                                        formatter: (value) => value
                                    }
                                }
                            }
                        });
                    });
                } else {
                    console.error('Nenhum dado de analista disponível.');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a lista de analistas:', error);
            });
    }
    // ----------------- Fim Funções de gráfico para todos os analistas ----------------- //

    /*  // ----------------- Funções de gráfico para todos os analistas individualmente ----------------- //
     function loadSingleAnalystChart(analystId, analystName, startDate = '', endDate = '') {
         analystChartsContainer.innerHTML = '';
         analystChartsContainer.className = 'row'; // Define layout para um único gráfico (ocupando toda a linha)

         axios.get(`/api/records/general/analyst/${analystId}`, {
             params: { start_date: startDate, end_date: endDate }
         })
             .then(response => {
                 const data = response.data;

                 if (data && analystId != 'Selecione') {
                     const chartContainer = document.createElement('div');
                     chartContainer.className = 'col-md-12 mb-4';
                     const canvas = document.createElement('canvas');
                     canvas.width = 400;
                     canvas.height = 200;
                     chartContainer.appendChild(canvas);
                     analystChartsContainer.appendChild(chartContainer);

                     new Chart(canvas.getContext('2d'), {
                         type: 'bar',
                         data: {
                             labels: ['Atrasos', 'Absenteísmo', 'Retorno E-mails', 'Erros Ct-es', 'Falha Envio Ocorrências', 'Falha Documentação Frota'],
                             datasets: [{
                                 label: 'Ocorrências',
                                 data: [data.late, data.absenteeism, data.return_emails, data.errors_ctes, data.failure_send_occurrences, data.fleet_documentation_failure],
                                 backgroundColor: [
                                     'rgba(191, 49, 55, 0.9)',
                                 ],
                                 borderColor: [
                                     'rgba(0, 0, 0, 0.9)',
                                 ],
                                 borderWidth: 1,
                                 maxBarThickness: 60,
                             }]
                         },
                         options: {
                             layout: {
                                 padding: {
                                     top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                     bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                                 }
                             },
                             scales: {
                                 y: {
                                     beginAtZero: true
                                 }
                             },
                             plugins: {
                                 legend: {
                                     display: true,
                                     position: 'bottom',
                                 },
                                 title: {
                                     display: true,
                                     position: 'bottom',
                                     text: analystName
                                 },
                                 datalabels: {
                                     anchor: 'end',
                                     align: 'end',
                                     color: '#000',
                                     font: {
                                         weight: 'bold'
                                     },
                                     formatter: function (value, context) {
                                         return value;
                                     }
                                 }
                             }
                         }
                     });
                 }
             })
             .catch(error => {
                 console.error('Erro ao carregar os dados do analista:', error);
             });
     }

     function loadSingleAnalystChartWithDifferenceDay(analystId, analystName, startDate = '', endDate = '') {
         analystChartsContainer.innerHTML = '';
         analystChartsContainer.className = 'row'; // Define layout para um único gráfico (ocupando toda a linha)

         axios.get(`/api/records/general/analyst/${analystId}`, {
             params: { start_date: startDate, end_date: endDate, type: 'day' }
         })
             .then(response => {
                 const data = response.data;
                 console.log(data)
                 const labels = data.map(record => formatDatePtBr(record.date));  // Extraí as datas para os rótulos
                 const lateData = data.map(record => record.late);
                 const absenteeismData = data.map(record => record.absenteeism);
                 const returnEmailsData = data.map(record => record.return_emails);
                 const errorsCtesData = data.map(record => record.errors_ctes);
                 const failureSendOccurrencesData = data.map(record => record.failure_send_occurrences);
                 const fleetDocumentationFailureData = data.map(record => record.fleet_documentation_failure);

                 if (data && analystId != 'Selecione') {
                     const chartContainer = document.createElement('div');
                     chartContainer.className = 'col-md-12 mb-4';
                     const canvas = document.createElement('canvas');
                     canvas.width = 400;
                     canvas.height = 200;
                     chartContainer.appendChild(canvas);
                     analystChartsContainer.appendChild(chartContainer);

                     new Chart(canvas.getContext('2d'), {
                         type: 'bar',
                         data: {
                             labels: labels,
                             datasets: [
                                 {
                                     label: 'Atrasos',
                                     data: lateData,
                                     backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Absenteísmo',
                                     data: absenteeismData,
                                     backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Retorno E-mails',
                                     data: returnEmailsData,
                                     backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Erros Ct-es',
                                     data: errorsCtesData,
                                     backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Falha Envio Ocorrências',
                                     data: failureSendOccurrencesData,
                                     backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Falha Documentação Frota',
                                     data: fleetDocumentationFailureData,
                                     backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 }
                             ]
                         },
                         options: {
                             layout: {
                                 padding: {
                                     top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                     bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                                 }
                             },
                             scales: {
                                 y: {
                                     beginAtZero: true
                                 }
                             },
                             plugins: {
                                 legend: {
                                     display: true,
                                     position: 'bottom',
                                 },
                                 title: {
                                     display: true,
                                     position: 'bottom',
                                     text: analystName
                                 },
                                 datalabels: {
                                     anchor: 'end',
                                     align: 'end',
                                     color: '#000',
                                     font: {
                                         weight: 'bold'
                                     },
                                     formatter: function (value, context) {
                                         return value;
                                     }
                                 }
                             }
                         }
                     });
                 }
             })
             .catch(error => {
                 console.error('Erro ao carregar os dados do analista:', error);
             });
     }

     function loadSingleAnalytChartByMonth(analystId, analystName, startDate = '', endDate = '') {
         analystChartsContainer.innerHTML = '';
         analystChartsContainer.className = 'row'; // Define layout para um único gráfico (ocupando toda a linha)

         axios.get(`/api/records/general/analyst/${analystId}`, {
             params: { start_date: startDate, end_date: endDate, type: 'month' }
         })
             .then(response => {
                 const data = response.data;

                 const labels = data.map(record => `${record.month}/${record.year}`);  // Extraí as datas para os rótulos
                 const lateData = data.map(record => record.late);
                 const absenteeismData = data.map(record => record.absenteeism);
                 const returnEmailsData = data.map(record => record.return_emails);
                 const errorsCtesData = data.map(record => record.errors_ctes);
                 const failureSendOccurrencesData = data.map(record => record.failure_send_occurrences);
                 const fleetDocumentationFailureData = data.map(record => record.fleet_documentation_failure);

                 if (data && analystId != 'Selecione') {
                     const chartContainer = document.createElement('div');
                     chartContainer.className = 'col-md-12 mb-4';
                     const canvas = document.createElement('canvas');
                     canvas.width = 400;
                     canvas.height = 200;
                     chartContainer.appendChild(canvas);
                     analystChartsContainer.appendChild(chartContainer);

                     new Chart(canvas.getContext('2d'), {
                         type: 'bar',
                         data: {
                             labels: labels,
                             datasets: [
                                 {
                                     label: 'Atrasos',
                                     data: lateData,
                                     backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Absenteísmo',
                                     data: absenteeismData,
                                     backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Retorno E-mails',
                                     data: returnEmailsData,
                                     backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Erros Ct-es',
                                     data: errorsCtesData,
                                     backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Falha Envio Ocorrências',
                                     data: failureSendOccurrencesData,
                                     backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 },
                                 {
                                     label: 'Falha Documentação Frota',
                                     data: fleetDocumentationFailureData,
                                     backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                     borderColor: 'rgba(0, 0, 0, 0.9)',
                                     borderWidth: 1,
                                     maxBarThickness: 70,
                                 }
                             ]
                         },
                         options: {
                             layout: {
                                 padding: {
                                     top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                     bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                                 }
                             },
                             scales: {
                                 y: {
                                     beginAtZero: true
                                 }
                             },
                             plugins: {
                                 legend: {
                                     display: true,
                                     position: 'bottom',
                                 },
                                 title: {
                                     display: true,
                                     position: 'bottom',
                                     text: analystName
                                 },
                                 datalabels: {
                                     anchor: 'end',
                                     align: 'end',
                                     color: '#000',
                                     font: {
                                         weight: 'bold'
                                     },
                                     formatter: function (value, context) {
                                         return value;
                                     }
                                 }
                             }
                         }
                     });
                 }
             })
             .catch(error => {
                 console.error('Erro ao carregar os dados do analista:', error);
             });
     }
     // ----------------- Funções de gráfico para todos os analistas individualmente ----------------- //

     // ----------------- Funções de gráfico para todos os analistas ----------------- //
     function loadAllAnalystCharts(startDate = '', endDate = '') {

         // Limpa os gráficos anteriores
         analystChartsContainer.innerHTML = '';
         analystChartsContainer.className = 'row row-cols-1 row-cols-md-2'; // Define layout para dois gráficos por linha

         axios.get('/api/records/general/analyst', {
             params: { start_date: startDate, end_date: endDate }
         })
             .then(response => {
                 const analysts = response.data;

                 if (analysts) {
                     analysts.forEach(analyst => {
                         const chartContainer = document.createElement('div');
                         chartContainer.className = 'col mb-4'; // Define colunas responsivas
                         const canvas = document.createElement('canvas');
                         canvas.width = 400;
                         canvas.height = 200;
                         chartContainer.appendChild(canvas);
                         analystChartsContainer.appendChild(chartContainer);

                         let analystName = analyst.analyst.name;

                         new Chart(canvas.getContext('2d'), {
                             type: 'bar',
                             data: {
                                 labels: ['Atrasos', 'Absenteísmo', 'Retorno E-mails', 'Erros Ct-es', 'Falha Envio Ocorrências', 'Falha Documentação Frota'],
                                 datasets: [{
                                     label: 'Ocorrências',
                                     data: [analyst.late, analyst.absenteeism, analyst.return_emails, analyst.errors_ctes, analyst.failure_send_occurrences, analyst.fleet_documentation_failure],
                                     backgroundColor: [
                                         'rgba(191, 49, 55, 0.9)',
                                     ],
                                     borderColor: [
                                         'rgba(0, 0, 0, 0.9)',
                                     ],
                                     borderWidth: 1,
                                     maxBarThickness: 30,
                                 }]
                             },
                             options: {
                                 layout: {
                                     padding: {
                                         top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                         bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                                     }
                                 },
                                 scales: {
                                     y: {
                                         beginAtZero: true
                                     }
                                 },
                                 plugins: {
                                     legend: {
                                         display: true,
                                         position: 'bottom',
                                     },
                                     title: {
                                         display: true,
                                         position: 'bottom',
                                         text: analystName
                                     },
                                     datalabels: {
                                         anchor: 'end',
                                         align: 'end',
                                         color: '#000',
                                         font: {
                                             weight: 'bold'
                                         },
                                         formatter: function (value, context) {
                                             return value;
                                         },
                                     }
                                 }
                             }
                         });
                     });
                 }
             })
             .catch(error => {
                 console.error('Erro ao carregar a lista de analistas:', error);
             });
     }

     function loadAnalystChartWithDifferenceDay(startDate = '', endDate = '') {
         // Limpa os gráficos anteriores
         analystChartsContainer.innerHTML = '';
         analystChartsContainer.className = 'row row-cols-1 row-cols-md-1'; // Define layout para dois gráficos por linha

         axios.get('/api/records/general/analyst', {
             params: { start_date: startDate, end_date: endDate, type: 'day' }
         })
             .then(response => {
                 const analysts = response.data;

                 // Garante que o retorno da API contenha dados válidos
                 if (analysts && analysts.length > 0) {
                     const groupedData = {};

                     // Agrupar os registros de cada analista por ID
                     analysts.forEach(record => {
                         const analystId = record.analyst_id;
                         if (!groupedData[analystId]) {
                             groupedData[analystId] = {
                                 analystName: record.analyst.name,
                                 labels: [],
                                 lateData: [],
                                 absenteeismData: [],
                                 returnEmailsData: [],
                                 errorsCtesData: [],
                                 failureSendOccurrencesData: [],
                                 fleetDocumentationFailureData: []
                             };
                         }

                         // Adicionar os dados ao grupo
                         groupedData[analystId].labels.push(formatDatePtBr(record.date));
                         groupedData[analystId].lateData.push(record.late);
                         groupedData[analystId].absenteeismData.push(record.absenteeism);
                         groupedData[analystId].returnEmailsData.push(record.return_emails);
                         groupedData[analystId].errorsCtesData.push(record.errors_ctes);
                         groupedData[analystId].failureSendOccurrencesData.push(record.failure_send_occurrences);
                         groupedData[analystId].fleetDocumentationFailureData.push(record.fleet_documentation_failure);
                     });

                     // Criar um gráfico para cada analista
                     Object.values(groupedData).forEach(analyst => {
                         // Cria um novo container para o gráfico de cada analista
                         const chartContainer = document.createElement('div');
                         chartContainer.className = 'col mb-4'; // Define colunas responsivas
                         const canvas = document.createElement('canvas');
                         canvas.width = 400;
                         canvas.height = 200;
                         chartContainer.appendChild(canvas);
                         analystChartsContainer.appendChild(chartContainer);

                         const analystName = analyst.analystName;

                         // Cria o gráfico para o analista atual
                         new Chart(canvas.getContext('2d'), {
                             type: 'bar',
                             data: {
                                 labels: analyst.labels, // Datas para o rótulo
                                 datasets: [
                                     {
                                         label: 'Atrasos',
                                         data: analyst.lateData,
                                         backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Absenteísmo',
                                         data: analyst.absenteeismData,
                                         backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Retorno E-mails',
                                         data: analyst.returnEmailsData,
                                         backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Erros Ct-es',
                                         data: analyst.errorsCtesData,
                                         backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Falha Envio Ocorrências',
                                         data: analyst.failureSendOccurrencesData,
                                         backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Falha Documentação Frota',
                                         data: analyst.fleetDocumentationFailureData,
                                         backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     }
                                 ]
                             },
                             options: {
                                 layout: {
                                     padding: {
                                         top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                         bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                                     }
                                 },
                                 scales: {
                                     y: {
                                         beginAtZero: true
                                     }
                                 },
                                 plugins: {
                                     legend: {
                                         display: true,
                                         position: 'bottom',
                                     },
                                     title: {
                                         display: true,
                                         position: 'bottom',
                                         text: analystName
                                     },
                                     datalabels: {
                                         anchor: 'end',
                                         align: 'end',
                                         color: '#000',
                                         font: {
                                             weight: 'bold'
                                         },
                                         formatter: function (value, context) {
                                             return value;
                                         }
                                     }
                                 }
                             }
                         });
                     });
                 } else {
                     console.error('Nenhum dado de analista disponível.');
                 }
             })
             .catch(error => {
                 console.error('Erro ao carregar a lista de analistas:', error);
             });
     }

     function loadAnalytChartByMonth(startDate = '', endDate = '') {
         // Limpa os gráficos anteriores
         analystChartsContainer.innerHTML = '';
         analystChartsContainer.className = 'row row-cols-1 row-cols-md-2'; // Define layout para dois gráficos por linha

         axios.get('/api/records/general/analyst', {
             params: { start_date: startDate, end_date: endDate, type: 'month' }
         })
             .then(response => {
                 const analysts = response.data;

                 // Garante que o retorno da API contenha dados válidos
                 if (analysts && analysts.length > 0) {
                     const groupedData = {};

                     // Agrupar os registros de cada analista por ID
                     analysts.forEach(record => {
                         const analystId = record.analyst_id;
                         if (!groupedData[analystId]) {
                             groupedData[analystId] = {
                                 analystName: record.analyst.name,
                                 labels: [],
                                 lateData: [],
                                 absenteeismData: [],
                                 returnEmailsData: [],
                                 errorsCtesData: [],
                                 failureSendOccurrencesData: [],
                                 fleetDocumentationFailureData: []
                             };
                         }

                         // Adicionar os dados ao grupo
                         groupedData[analystId].labels.push(`${record.month}/${record.year}`);
                         groupedData[analystId].lateData.push(record.late);
                         groupedData[analystId].absenteeismData.push(record.absenteeism);
                         groupedData[analystId].returnEmailsData.push(record.return_emails);
                         groupedData[analystId].errorsCtesData.push(record.errors_ctes);
                         groupedData[analystId].failureSendOccurrencesData.push(record.failure_send_occurrences);
                         groupedData[analystId].fleetDocumentationFailureData.push(record.fleet_documentation_failure);
                     });

                     // Criar um gráfico para cada analista
                     Object.values(groupedData).forEach(analyst => {
                         // Cria um novo container para o gráfico de cada analista
                         const chartContainer = document.createElement('div');
                         chartContainer.className = 'col mb-4'; // Define colunas responsivas
                         const canvas = document.createElement('canvas');
                         canvas.width = 400;
                         canvas.height = 200;
                         chartContainer.appendChild(canvas);
                         analystChartsContainer.appendChild(chartContainer);

                         const analystName = analyst.analystName;

                         // Cria o gráfico para o analista atual
                         new Chart(canvas.getContext('2d'), {
                             type: 'bar',
                             data: {
                                 labels: analyst.labels, // Datas para o rótulo
                                 datasets: [
                                     {
                                         label: 'Atrasos',
                                         data: analyst.lateData,
                                         backgroundColor: 'rgba(191, 49, 55, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Absenteísmo',
                                         data: analyst.absenteeismData,
                                         backgroundColor: 'rgba(54, 162, 235, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Retorno E-mails',
                                         data: analyst.returnEmailsData,
                                         backgroundColor: 'rgba(255, 206, 86, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Erros Ct-es',
                                         data: analyst.errorsCtesData,
                                         backgroundColor: 'rgba(75, 192, 192, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Falha Envio Ocorrências',
                                         data: analyst.failureSendOccurrencesData,
                                         backgroundColor: 'rgba(153, 102, 255, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     },
                                     {
                                         label: 'Falha Documentação Frota',
                                         data: analyst.fleetDocumentationFailureData,
                                         backgroundColor: 'rgba(255, 159, 64, 0.9)',
                                         borderColor: 'rgba(0, 0, 0, 0.9)',
                                         borderWidth: 1,
                                         maxBarThickness: 50
                                     }
                                 ]
                             },
                             options: {
                                 layout: {
                                     padding: {
                                         top: 30,  // Pode ajustar para mais espaçamento entre o título e o gráfico
                                         bottom: 30  // Aumenta o espaço entre o gráfico e o final do canvas (empurra o gráfico para cima)
                                     }
                                 },
                                 scales: {
                                     y: {
                                         beginAtZero: true
                                     }
                                 },
                                 plugins: {
                                     legend: {
                                         display: true,
                                         position: 'bottom',
                                     },
                                     title: {
                                         display: true,
                                         position: 'bottom',
                                         text: analystName
                                     },
                                     datalabels: {
                                         anchor: 'end',
                                         align: 'end',
                                         color: '#000',
                                         font: {
                                             weight: 'bold'
                                         },
                                         formatter: function (value, context) {
                                             return value;
                                         }
                                     }
                                 }
                             }
                         });
                     });
                 } else {
                     console.error('Nenhum dado de analista disponível.');
                 }
             })
             .catch(error => {
                 console.error('Erro ao carregar a lista de analistas:', error);
             });
     }
     // ----------------- Funções de gráfico para todos os analistas ----------------- // */

    // Carrega os analistas na seleção
    axios.get('/api/analysts')
        .then(response => {
            const analysts = response.data;
            /* const optDefault = document.createElement('option');
            optDefault.text = 'Selecione';
            analystSelect.appendChild(optDefault); */
            /*  const option = document.createElement('option');
             option.value = 'all';
             option.text = 'Todos';
             analystSelect.appendChild(option); */
            analysts.forEach(analyst => {
                const option = document.createElement('option');
                option.value = analyst.id;
                option.text = analyst.name;
                analystSelect.appendChild(option);
            });
            // Atualiza o Bootstrap Select após adicionar as opções
            $('#analystSelect').selectpicker('refresh');

        })
        .catch(error => {
            console.error('Erro ao carregar analistas:', error);
        });
});

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

// Função para pegar data atual
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() retorna o mês de 0 a 11
    const day = String(today.getDate()).padStart(2, '0'); // getDate() retorna o dia do mês

    return `${year}-${month}-${day}`;
}
