import Vuex from 'vuex'

const createStore = () => {
	return new Vuex.Store({
		state: {
			name: '',
			channels: [],
		},
		mutations: {
			changeName (state, payload) {
				state.name = payload.name
			},
			addChannel (state, payload) {
				state.channels.push(payload)
			}
		},
		actions: {
    
		}
	})
}

export default createStore
