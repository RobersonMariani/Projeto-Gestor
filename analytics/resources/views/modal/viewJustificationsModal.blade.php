<!-- Modal para Ver Justificativas -->
<div class="modal fade" id="viewJustificationsModal" tabindex="-1" aria-labelledby="viewJustificationsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="viewJustificationsModalLabel">Justificativas</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Tabela para exibir justificativas -->
                <div id="justifications-content">
                    <table class="table table-striped table-hover text-wrap" id="justifications-view">
                        <thead>
                            <tr>
                                <th style="width: 14%">Data</th>
                                <th class="text-center">Justificativa</th>
                                <th>Anexo</th>
                                <th style="width: 12%">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="justifications-table-body">
                            <!-- As justificativas reais serão carregadas aqui via AJAX -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>
