import { useEffect, useState } from 'react';
import Login from './components/Login';
import Message from './components/Message';
import './index.css';

function App() {

  const [name, setName] = useState(localStorage.getItem('chatApp_name') || null)

  const [click,setClick] = useState(false)

  useEffect(()=>{
    setName(localStorage.getItem('chatApp_name') || null);
  
  },[click])

  return (

    <>
    {!name && <Login refresh={()=>{setClick(!click)}}/>}
    {name && <Message name={name}/>}
    </>

      
  );
}

export default App;
