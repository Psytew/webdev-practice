import React from 'react'
import io from 'socket.io-client'

export const CTX = React.createContext();

const initState = {
	general: [
		{from: 'aaron', msg: 'hello'}, {from: 'casey', msg: 'hiya'}, {from: 'dave', msg: 'hey'}
	], topic2: [
		{from: 'aaron', msg: 'hello'}, {from: 'casey', msg: 'hiya'}, {from: 'dave', msg: 'hey'}
	]
}

function reducer(state, action){
	const {from, msg, topic} = action.payload
	switch(action.type) {
		case 'RECEIVE_MESSAGE':
			return {
				...state,
				[topic]: [
				...state[topic],
					{
						from,
						msg
					}
				]
			}
		default:
			return state
	}
}

function sendChatAction(value) {
	socket.emit('chat-message', value)
}

let socket = null;

export default function Store(props) {

	if (socket == null){
		socket = io.connect('http://localhost:3001')
	}

	const [allChats] = React.useReducer(reducer, initState)



	return (
		<CTX.Provider value={{allChats, sendChatAction}}>
			{props.children}
		</CTX.Provider>
	) 
}