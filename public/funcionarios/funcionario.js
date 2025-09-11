const funcionariosTableBody = document.getElementById('funcionariosTableBody')

async function mostrarFuncionarios() {
    funcionariosTableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>'

    try {
        const response = await fetch('/api/funcionarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Falha ao buscar os funcionarios.')
        } 

        const funcionarios = await response.json()

        funcionariosTableBody.innerHTML = ''

        if (funcionarios.length === 0 ) {
            const row = document.createElement('tr')
            row.innerHTML = '<td colspan="4" style="text-align: center;">Nenhum funcionário encontrado.</td>'
            funcionariosTableBody.appendChild(row)
        } else {
            funcionarios.forEach(funcionario => {
                const row = document.createElement('tr')

                const nomecell = document.createElement('td')
                nomecell.textContent = funcionario.nome_completo
                nomecell.style.color = '#2563eb'

                const cpfCell = document.createElement('td')
                cpfCell.textContent = funcionario.cpf

                const cargoCell = document.createElement('td')
                cargoCell.textContent = funcionario.cargo

                const codigoAdesaoCell = document.createElement('td')
                codigoAdesaoCell.textContent = funcionario.numero_adesao

                row.appendChild(nomecell)
                row.appendChild(cpfCell)
                row.appendChild(cargoCell)
                row.appendChild(codigoAdesaoCell)

                funcionariosTableBody.appendChild(row)
            })
        }
    } catch (err) {
        console.log('Erro ao buscar funcionarios', err.message)
        funcionariosTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">${err.message || 'Erro ao carregar funcionários.'}</td></tr>`;
    }
}

function abrirModalCadastrarFuncionarios() {
    const modalCadastrarFuncionario = document.getElementById('modalCadastrarFuncionario')
    modalCadastrarFuncionario.style.display = "block"
}

async function cadastrarFuncionario() {
    
    const nomeFuncionario = document.getElementById('nomeFuncionario').value
    const CPF = document.getElementById('CPF').value
    const email = document.getElementById('email').value
    const dataNascimento = document.getElementById('dataNascimento').value
    const telefone = document.getElementById('telefone').value
    const cargo = document.getElementById('cargo').value
    const dataContratacao = document.getElementById('dataContratacao').value

    if (!nomeFuncionario || !CPF || !email || !dataNascimento || !telefone || !cargo || !dataContratacao) {
        alert('Por favor, varifique se esta tudo preenchido no cadastro!!')
        return
    }

    console.log('nome Funcionario:', nomeFuncionario)
    console.log('CPF:', CPF)
    console.log('email:', email)
    console.log('data de Nascimento:', dataNascimento)
    console.log('telefone:', telefone)
    console.log('cargo:', cargo)
    console.log('data de Contratacao:', dataContratacao)

    try {
        const response = await fetch('/api/registrar-entrada', {
            method: 'POST',
            headers: {
                'Content-Type:': 'application/json'
            },
            body: JSON.stringify({
                nomeFuncionario: nomeFuncionario,
                CPF: CPF,
                email: email,
                dataNascimento: dataNascimento,
                telefone: telefone,
                cargo: cargo,
                dataContratacao: dataContratacao
            })
        })

        const result = await response.json()

        if (response.ok) {
            alert(result.message)
            
        }
    } catch (error) {
        
    }

}