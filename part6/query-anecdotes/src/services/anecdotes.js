const backendUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(backendUrl)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export const updateAnecdote = async (anecdote) => {
    const response = await fetch(`${backendUrl}/${anecdote.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(anecdote)
    })
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export const createAnecdote = async (content) => {
    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content, votes: 0 })
    })
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}