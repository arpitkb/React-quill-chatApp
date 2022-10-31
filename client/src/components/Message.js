import React, { useState,useCallback, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import axios from 'axios'
import io from "socket.io-client";

const modules = {
  toolbar: [
    ['bold', 'italic','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['code-block']
  ],
}

const formats = [
  'bold', 'italic', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image',
  'code-block'
]


const Message = ({name}) => {

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [connected, setConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false);

  const lastRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  });


  const sendMessage = async (msg)=>{
    if (!connected) return;
      setMessages((prev)=>{
          return [...prev,msg]
      })
      socket.emit("send-new-message", { message: msg , name });
      await axios.post("https://whatsapp-clone-4cbbd-default-rtdb.firebaseio.com/chats.json",msg );
  }


  const [content, setContent] = useState('');

  // socket.io use effects
  useEffect(() => {
    const url = process.env.NODE_ENV==='development' ? "localhost:8080" :  window.location.host
    console.log(url)
    const newsocket = io(`ws://${url}`);
    setSocket(newsocket);

    const getMsgs = async() => {
      const msgs = await axios.get("https://whatsapp-clone-4cbbd-default-rtdb.firebaseio.com/chats.json");
    
      msgs && msgs.data &&  setMessages(Object.values(msgs && msgs.data && msgs.data))
    }

    getMsgs()

    return () => newsocket.close();
  }, []);



  useEffect(() => {
    if (!socket) return;

    socket.emit("setUp", name);

    const callback = (msg) => {
      // console.log(msg)
      setMessages((prev)=>{
          return [...prev,msg]
      })
    };

    const connectedCallback = () => {
      console.log("You joined the room");
      setConnected(true);
    };


    const typingCallback = () =>{
      console.log("typing")
      setIsTyping(true);
    }

    socket.on('typing ',typingCallback)
    socket.on("connected", connectedCallback);
    socket.on("recieve-new-message", callback);

    return () => {
      socket.off("connected", connectedCallback);
      socket.off("recieve-new-message", callback);
      socket.off('typing', typingCallback)
    };
  }, [socket]);


  const startTyping = ()=>{
    if(!socket) return;
    if(!isTyping){
      socket.emit('typing')
    }
    
  }


  return (
    <div className='p-5 bg-gray-400 w-screen text-whit h-screen flex flex-col flex-grow border-r border-l border-gray-700'>
        <div className='py-5 px-4 flex flex-col overflow-y-auto h-full'>
        {messages.length>0 &&  messages.map((el, index) => (
                  <>
                    <div
                      key={index}
                      ref={messages.length === index + 1 ? lastRef : null}
                      className={`bg-gray-300 rounded-t-2xl mt-1.5 py-1 px-4 max-w-sm break-words ${
                        el.name==name
                          ? "rounded-l-2xl self-end"
                          : " rounded-r-2xl self-start"
                      }`}
                    >
                      <ReactQuill 
                        value={el.content} 
                        readOnly
                        theme='bubble'
                      />
                    </div>
                    <div
                      key={index==0?'a123dsfe':-1*index}
                      className={`mb-1.5 text-xs text-[#71767B] ms-1 ${
                        el.name===name && "self-end"
                      }`}
                    >
                      {el.name != name &&
                        el.name.split(" ")[0].toLowerCase()} 
                    </div>
                  </>
                ))}
        </div>
        <div className='mt-auto flex flex-col'>
        <div className='px-3 text-sm'><em>Press Right ctrl to send</em></div>
        {isTyping && <div className='px-3 text-sm'><em>Typing...</em></div>}
            <div className='flex items-center py-1.5 px-3'>
              
               <ReactQuill 
                  modules={modules} 
                  formats={formats} 
                  className='max-h-56 overflow-y-auto w-screen' 
                  onKeyDown={(e)=>{
                    startTyping();
                    // console.log('typing..')
                    if(e.keyCode == 17){
                        const msg = {content,name}
                        sendMessage(msg)
                        setContent('')
                    }
                  }}
                  theme='snow' 
                  value={content} 
                  onChange={setContent}
                />
            </div>
        </div>
    </div>
  )
}


export default Message