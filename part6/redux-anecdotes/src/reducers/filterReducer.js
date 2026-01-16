
const initialState = ""

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return action.payload
        default:
            state
    }
    return state
}

export default reducer