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
                nomecell.textContent = funcionario.nomeFuncionario

                const cpfCell = document.createElement('td')
                cpfCell.textContent = funcionario.cpf

                const cargoCell = document.createElement('td')
                cargoCell.textContent = funcionario.cargo

                const codigoAdesaoCell = document.createElement('td')
                codigoAdesaoCell.textContent = funcionario.codigoAdesao

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