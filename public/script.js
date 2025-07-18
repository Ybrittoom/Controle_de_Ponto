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

//Variável global para armazenar o ID do ponto atual (opcional, mas facilita)
let currentPontoId = null

//salvar entrada
async function salvar_entrada() {
    const dataHoraInput = document.getElementById('data-hora-entrada')
    const dataHora = dataHoraInput.value

    const numero_adesao = 3 // tenho que mudar e dar um jeito de pegar o ID de um usuario que esta na empresa

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
                numero_adesao: numero_adesao,
                data_hora_entrada: dataHora
            })
        })

        const result = await response.json()

        if (response.ok) {
            alert(result.message)
            fechar_modal('modal-entrada')

            //armazenar o id_ponto retornado pelo back bb
            if (result.id_ponto) {
                currentPontoId = result.id_ponto
                document.getElementById('id-ponto-saida').value = currentPontoId;
                document.getElementById('id-ponto-almoco').value = currentPontoId;
                console.log('ID do Ponto atual armazenado:', currentPontoId);
            }
        } else {
            alert('Erro ao registrar entrada' + " " + result.error)
        }
    } catch (err) {
        console.error('Erro na requisiçao:', err)
        alert('Erro na conexao com o servidor')
    }
}

// salvar saida
async function salvarSaida() {
    const dataHoraInput = document.getElementById('data-hora-saida')
    const dataHoraSaida = dataHoraInput.value
    const id_ponto = document.getElementById('id_ponto').value //pega o valor do input que no caso é o ID do funcionario
    const id_ponto_saida = document.getElementById('id-ponto-saida') //campo oculto no HTML

    const pontoParaSaida = id_ponto_saida

    if (!dataHoraSaida || !pontoParaSaida) { //verifica se os campos estao preenchidos corretamente
        alert('Por favor, preencha os campos data/hora e o ID do funcionarios')
        return
    }

    try {
        const response = await fetch(`/api/registrar-saida/${id_ponto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data_hora_saida: dataHoraSaida })
        })

        const result = await response.json()

        if (response.ok) {
            alert(result.message)
            fechar_modal('modal-saida')
        } else {
            alert('Erro ao registrar saida' + " " + result.error)
        }
    } catch (err) {
        console.error('Erro na requisiçao', err)
        alert('Erro na conexao com o servidor', err)
    }
}

async function salvarAlmoco() {
    const dataHoraInput = document.getElementById('data-hora-almoco-input')
    const dataHoraAlmoco = dataHoraInput.value
    const numero_adesao = document.getElementById('numero_adesao').value //testando com o numero de adesao
    const id_ponto_almoco = document.getElementById('id-ponto-almoco').value

    // verificando o q esta pegando
    console.log(document.getElementById('data-hora-almoco-input').value);
    console.log(document.getElementById('numero_adesao').value);
     console.log('ID do Ponto (Almoço):', id_ponto_almoco); // NOVO LOG

    if (!dataHoraAlmoco || !numero_adesao || !id_ponto_almoco) {
        alert('Por favor! Preencha os campos data/Hora e o Numero de adesao do funcionario')
        return
    }

    try {
        const response = await fetch(`/api/registrar-almoco/${id_ponto_almoco}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hora_almoco: dataHoraAlmoco})
        })
        const result = await response.json()

        if(response.ok) {
            alert(result.message)
            fechar_modal('modal-almoco')
        } else {
            alert('Erro ao registrar almoço: ' + (result.error || result.message || 'Erro desconhecido'));
        }
    } catch (err) {
        console.error('Erro na requisiçao', err)
        alert('Erro na conexao com o servidor', err)
    }
}