//funçao para abri o modal
function abrir_modal(idModal) {
    const modal = document.getElementById(idModal)
    if (modal) {
        modal.style.display = "block"
    }
}

//fechar modal
function fechar_modal(idModal) {
    const modal = document.getElementById(idModal)
    if (modal) {
        modal.style.display = "none"
    }
}



//salvar entrada
function salvar_entrada() {
    const dataHoraInput = document.getElementById('data-hora-entrada')
    const dataHora = dataHoraInput.value
}
