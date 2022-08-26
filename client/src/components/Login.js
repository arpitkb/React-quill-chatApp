import React, { useState } from 'react'

const Login = ({refresh}) => {

    const [name,setName] = useState('');


  return (
    <div className='text-center h-screen bg-gray-300 flex flex-col'>
        <div className='my-auto'>
            <h4 className='font-bold text-lg mb-3'>Login</h4>
            <div>
            <input value={name} onChange={e=>{setName(e.target.value)}} className='border border-gray-800 px-1 py-2 rounded-md' placeholder='Enter Name'/>
            <button onClick={()=>{
                localStorage.setItem("chatApp_name",name);
                refresh()
            }} 
            className='ml-4 bg-teal-400 px-3 py-2 rounded-md'>Join chat</button>
            </div>
        </div>
    </div>

  )
}

export default Login