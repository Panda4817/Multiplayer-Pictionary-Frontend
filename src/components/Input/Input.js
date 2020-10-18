import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons';

import './Input.css';

const Input = ({ setMessage, sendMessage, message, disable }) => (
<div className="row justify-content-center">
  <form className="col">
  <div className="input-group">
    <input
      className="form-control type_msg"
      type="text"
      placeholder="Type your guess..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
      disabled={disable}
    />
    <div className="input-group-append">
        <button 
        type="submit" title="Send"
        className="sendButton input-group-text send_btn btn"
        disabled={disable} 
        onClick={e => sendMessage(e)}>
            <FontAwesomeIcon icon={faPaperPlane} />
        </button>    
    </div>
    </div>
  </form>  
</div>

  
)

export default Input;