import React, { useState,useRef,useCallback ,useMemo, useEffect } from 'react'
import JoditEditor from "jodit-react";
import Editor from './Editor';
import TextareaAutosize from "react-textarea-autosize";
import axios from 'axios'
import io from "socket.io-client";

const config = {
  theme:"dark",
  useSearch: false,
  spellcheck: false,
  enter: "p",
  defaultMode: "1",
  toolbarAdaptive: false,
  toolbarSticky: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  minHeight:150,
  maxHeight:300,
  minWidth: null,
  buttons:
    "bold,italic,underline,ul,strikethrough,ol,image,link,source",
  editorCssClass: "alic",
  placeHolder: "",
  controls:{

  }
  
};


const Message = ({name}) => {

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [connected, setConnected] = useState(false)

  const lastRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  });


  const sendMessage = async (msg)=>{
    if (!connected) return;
      // messages.push(msg);
      setMessages((prev)=>{
          return [...prev,msg]
      })
      // setMessages([...messages,msg])
      socket.emit("send-new-message", { message: msg , name });
      await axios.post("https://whatsapp-clone-4cbbd-default-rtdb.firebaseio.com/chats.json",msg );
      // console.log("hah")
      
  }


  const [content, setContent] = useState('');

  // socket.io use effects

  useEffect(() => {
    const newsocket = io("ws://localhost:8080");
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
      // messages.push(msg)
      // console.log(messages)
    };

    const connectedCallback = () => {
      console.log("You joined the room");
      setConnected(true);
    };

    
    socket.on("connected", connectedCallback);
    socket.on("recieve-new-message", callback);

    return () => {
      socket.off("connected", connectedCallback);
      socket.off("recieve-new-message", callback);
    };
  }, [socket]);



  return (
    <div className='p-5 w-screen text-whit h-screen flex flex-col flex-grow border-r border-l border-gray-700'>
        <div className='py-5 px-4 flex flex-col overflow-y-auto h-full border border-gray-700 rounded-lg'>
        {messages.length>0 &&  messages.map((el, index) => (
                  <>
                    <div
                      key={index}
                      ref={messages.length === index + 1 ? lastRef : null}
                      className={`bg-[#caedeb] rounded-t-2xl mt-1.5 py-1 px-4 max-w-sm break-words ${
                        el.name==name
                          ? "rounded-l-2xl self-end"
                          : " rounded-r-2xl self-start"
                      }`}
                    >
                      {el.content}
                    </div>
                    <div
                      key={index==0?'a123dsfe':-1*index}
                      className={`mb-1.5 text-xs text-[#71767B] ms-1 ${
                        el.name===name && "self-end"
                      }`}
                    >
                       {/* {messageTimeDisplay(el.createdAt)}{" "} */}
                      {el.name != name &&
                        el.name.split(" ")[0].toLowerCase()} 
                    </div>
                  </>
                ))}
        </div>
        {/* <div className='px-4 py-2 border mt-4 border-gray-700 flex flex-col rounded-lg'> */}
            {/* <div className='border-gray-700 mt-2'> */}
            {/* <Editor
              config={config}
              value={content}
              onChange={(c) => {
                setContent(c);
                console.log(c);
              }}
              onKeyDown={(e)=>{
                console.log(e)
              }}
            /> */}
            
            {/* </div> */}
        {/* </div> */}
        <div className=' mt-auto flex flex-col'>
              {/* <div className='ml-5 mb-10 mr-auto'>
                <TypingLoader />
              </div> */}
              <div className='border-y flex items-center border-gray-700 py-1.5 px-3'>
                <TextareaAutosize
                  style={{ resize: "none" }}
                  minRows={1}
                  placeholder='Start a new message'
                  value={content}
                  maxRows={10}
                  // onBlur={() => {
                  //   socket.emit("stop-typing", chat._id);
                  // }}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      e.preventDefault();
                      if(content.trim()==="") return;
                      const msg = {content,name}
                      sendMessage(msg);
                      setContent('')
                    }
                  }}
                  onChange={
                    // updateTyping
                    (e)=>{
                      setContent(e.target.value)
                    }
                  }
                  className='bg-transparent px-4 outline-none text-black text-sm placeholder-gray-500 w-full border border-gray-700 focus:border-[#1d9bf0] rounded-3xl py-2'
                />
                <button
                  onClick={() => {
                    // socket.emit("stop-typing", chat._id);
                    // sendMessage();
                    // ref.current.value = "";
                  }}
                  // disabled={ref.current && !ref.current.value.trim()}
                  className='hoverAnim disabled:cursor-not-allowed cursor-pointer h-9 w-9 flex justify-center mx-1 items-center xl:px-0'
                >
                  {/* <ChevronDoubleRightIcon className='h-5 text-[#1d9bf0]' /> */}
                </button>
              </div>
            </div>
    </div>
  )
}


export default Message