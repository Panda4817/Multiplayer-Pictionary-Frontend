import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
    let isSentByCurrentUser = false;

    const trimmedName = name.trim().toLowerCase();

    if(user === trimmedName) {
        isSentByCurrentUser = true;
    }

  return (
    isSentByCurrentUser
      ? (
        <div className="d-flex justify-content-end mb-3">
            <div className="msg_container_out">
                <div sender={user} className="msg text-break">{ReactEmoji.emojify(text)}</div>
                <div className="msg_name_out">
                    {user[0].toUpperCase() + user.slice(1)}
                </div>
            </div>
            <div className="img_cont_msg">
                <FontAwesomeIcon icon={faUser} className="user_img_msg_out" />
            </div>
        </div>
        )
        : (
        <div className="d-flex justify-content-start mb-3">
            <div className="img_cont_msg">
                <FontAwesomeIcon icon={faUser} className={user === "admin" ? "admin_text user_img_msg_in" : "user_img_msg_in"} />
            </div>
            <div className={user === "admin" ? "admin msg_container_in" : "msg_container_in"}>
                <div sender={user} className="msg text-break">{ReactEmoji.emojify(text)}</div>
                <div className={user === "admin" ? "admin_text msg_name_in" : "msg_name_in"}>
                    {user[0].toUpperCase() + user.slice(1)}
                </div>
            </div>
        </div>
        )
  );
}

export default Message;