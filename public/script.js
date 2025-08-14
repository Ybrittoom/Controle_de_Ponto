//funçao para abri o modal
function abrir_modal(idModal) {
    const modal = document.getElementById(idModal)
    console.log(modal)
    if (modal) {
        modal.style.display = "block"
    }
}

//abrir modal 'salvarSaida'
function abrir_modal_saida() {
    if (!currentPontoId) {
        alert('Nenhum ponto de entrada registrado para esta sessao.')
    }

    document.getElementById('id-ponto-saida').value = currentPontoId
    abrir_modal('modal-saida')
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
    const codigoAdesao = document.getElementById('codigo_de_adesao').value

    //const numero_adesao = 2 // tenho que mudar e dar um jeito de pegar o ID de um usuario que esta na empresa

    if (!dataHora) {
        alert('Por favor, verifique se o codigo de adesao ou data/hora esta corretos!')
        return
    }

        console.log('Codigo de Adesao:' , codigoAdesao)
        console.log('Data/Hora de entrada: ', dataHora)

    try {
        const response = await fetch('/api/registrar-entrada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigoAdesao: codigoAdesao,
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
                console.log("ID do ponto atual armazenado:", currentPontoId)
                alert('ATENÇÃO: ID do ponto registrado(NAO PERCA!): ', currentPontoId)
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

    //verificando se ha um ponto de entrada ativo
    if (!currentPontoId) {
        alert('Nenhum ponto de entrada registrado para esta sessao. Por favor, registre sua entrada primeiro!')
        return
    }

    const dataHoraInput = document.getElementById('data-hora-saida')
    const dataHoraSaida = dataHoraInput.value
    const id_ponto = document.getElementById('id_ponto').value //pega o valor do input que no caso é o ID do funcionario
    const id_ponto_saida = document.getElementById('id-ponto-saida') //campo oculto no HTML

    const pontoParaSaida = id_ponto_saida

    if (!dataHoraSaida || !pontoParaSaida) { //verifica se os campos estao preenchidos corretamente
        alert('Por favor, preencha os campos data/hora e o ID do funcionarios')
        return
    }

    console.log('ID do ponto: ', id_ponto)
    console.log('Data/Hora da saida: ', dataHoraSaida)

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
            currentPontoId = null
        } else {
            alert('Erro ao registrar saida' + " " + result.error)
        }
    } catch (err) {
        console.error('Erro na requisiçao', err)
        alert('Erro na conexao com o servidor', err)
    }
}

async function salvarAlmoco() {
    
    const id_ponto = document.getElementById('id_ponto_almoco').value
    const hora_almoco = document.getElementById('data_hora_almoco').value

    if (!hora_almoco || !id_ponto) {
        alert('Por Favor! Preencha os campos data/hora ou Id do ponto(fornecido ao cadastrar a entrada)!')
        return
    }

    console.log("Id Ponto:", id_ponto)
    console.log("hora Almoço:", hora_almoco)

    try {
        const response = await fetch(`/api/registrar-almoco/${id_ponto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hora_almoco: hora_almoco})
        })

        const result = await response.json()

        if (response.ok) {
            alert(result.message)
            fechar_modal('modal-almoco')
            currentPontoId = null
        } else {
            alert('Erro ao registrar almoço:' + " " + result.error)
        }
    } catch (err) {
        console.error('Erro na requisiçao:', err)
    }
}

//FUNÇAO PARA CARREGAR O HISTORICO DE PONTOS
async function carregarHistoricoDePontos() {
    const id_funcionario = document.getElementById('id_funcionario').value
    const historico_lista = document.getElementById('historico-lista')

    if (!id_funcionario) {
        alert('Por Favor! Insira o seu codigo de adesao ou do funcionario que deseja ver o historico!')
        return
    }

    try {
        const response = await fetch(`/api/historico-de-pontos/${id_funcionario}`)
        const result = await response.json()

        historico_lista.textContent = "" //limpando o campo de lista 

        if (!Array.isArray(result)) {
            alert(result.message || "Erro inesperado")
            return
        }

        result.forEach(ponto => {
            const dataHoraEntrada = ponto.data_hora_entrada.replace('T', ' ', 'Z')
            const horaAlmoco = ponto.hora_almoco
            const dataHoraSaida = ponto.data_hora_saida ? ponto.data_hora_saida.replace('T', ' ') : ''

            const entradaFormatada = dataHoraEntrada.replace('T', ' ').replace('Z', '').split('.')[0]
            const saidaFormatada = dataHoraSaida.replace('T', ' ').replace('Z', '').split('.')[0]

            const item =  document.createElement('li')
            item.textContent = `Entrada ${entradaFormatada} | Almoço: ${horaAlmoco} | Saida: ${saidaFormatada}`
            historico_lista.appendChild(item) //adiciona um novo elemento "li" dentro da lista desordenada
        });

        
    } catch (err) {
        console.error("Erro ao tentar mostrar o historico: ", err)
        console.log(err)
    }

}