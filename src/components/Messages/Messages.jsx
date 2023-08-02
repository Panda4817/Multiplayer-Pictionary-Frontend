import React from 'react'

import ScrollToBottom from 'react-scroll-to-bottom'

import Message from './Message/Message'

import './Messages.css'

// Component to display messages
const Messages = ({ messages, name, avatar }) => {
    return (
        <ScrollToBottom className="messages">
            {messages.map((message, i) => <div key={i}><Message message={message} name={name} avatar={avatar} /></div>)}
        </ScrollToBottom>
    )

}

export default Messages
