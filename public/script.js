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
async function salvar_entrada() {
    const dataHoraInput = document.getElementById('data-hora-entrada')
    const dataHora = dataHoraInput.value

    const idFuncionario = 1

    if (!dataHora) {
        alert('Por favor, selecione a data e hora de entrada!!')
        return
    }

    try {
        const response = await fetch('/api/registrar-entrada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_funcionario: idFuncionario,
                data_hora_entrada: dataHora
            })
        })

        const result = await response.json()

        if (response.ok) {
            alert(result.message)
            fechar_modal('modal-entrada')
        } else {
            alert('Erro ao registrar entrada' + result.error)
        }
    } catch (err) {
        console.error('Erro na requisiçao:', err)
        alert('Erro na conexao com o servidor')
    }
}
