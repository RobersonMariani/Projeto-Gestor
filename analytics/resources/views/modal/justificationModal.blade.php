<!-- Modal para Justificativa -->
<div class="modal fade" id="justificationModal" tabindex="-1" aria-labelledby="justificationModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="justificationModalLabel">Adicionar Justificativa</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="justification-form">
                    @csrf
                    <input type="hidden" name="justification_id" id="justification_id">
                    <input type="hidden" name="analyst_id" id="analyst_id">
                    <input type="hidden" name="field" id="field">
                    <input type="hidden" name="record_id" id="record-id">
                    <div class="mb-3">
                        <label for="justification-text" class="form-label">Justificativa</label>
                        <textarea class="form-control" id="justification-text" name="justification" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="justification-file" class="form-label">Anexar Documento</label>
                        <input class="form-control" type="file" id="justification-file" name="file">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary" id="save-justification">Salvar Justificativa</button>
            </div>
        </div>
    </div>
</div>
