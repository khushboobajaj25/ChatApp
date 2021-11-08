import React,{useState,useEffect} from 'react'
import "./App.css";
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat(props) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList,setMessageList] = useState([]);
    const sendMessage = async () =>{
        if(currentMessage!==""){
           const messageData ={
               room:props.room,
               author:props.username,
               message:currentMessage,
               time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()+":"+new Date(Date.now()).getSeconds(),



           }; 
           await props.socket.emit("send_message",messageData);
           setMessageList(messageList=>[...messageList,messageData]);
           setCurrentMessage("");
        }
    }
    useEffect(() => {
        props.socket.on("receive_message",(data)=>{
            setMessageList(messageList=>[...messageList,data]);
        })
    }, [props.socket]);
    return (
        <div className="chat-window">
           <div className="chat-header">

               <p>Live Chat</p>
            </div> 
           <div className="chat-body">
               <ScrollToBottom className="message-container">
                 {messageList.map((messageContent,index)=>{
                   return (<div className="message" id={props.username===messageContent.author?"you":"other"}>
                       <div>
                           <div className="message-content">
                               <p>{messageContent.message}</p>
                           </div>
                           <div className="message-meta">
                               <p id="time">{messageContent.time}</p>
                               <p id="author">{messageContent.author}</p>
                           </div>
                       </div>
                   </div>)
               })}
                </ScrollToBottom>
            </div>
              
               
           <div className="chat-footer">
               <input type="text" value={currentMessage} placeholder="Hey" onChange={(e)=>{setCurrentMessage(e.target.value)}}

                    onKeyPress={(e) => {e.key === "Enter" && sendMessage();}}
               />
               <button onClick={sendMessage}>&#9658;</button>
            </div> 
        </div>
    )
}

export default Chat
