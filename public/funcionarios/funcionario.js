
async function mostrarFuncionarios() {
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

        const
    }
}