import React from 'react'
import { useEffect } from 'react';
import BookList from './BookList';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import SellerDashboard from './SellerDashboard';
function Home() {

    const token =useSelector((state)=>{
    return state.auth.token;
})
const navigate=useNavigate()

const role =useSelector((state)=>{
    return state.auth.role
})

useEffect(() => {
  if (!token) {
    navigate("/");
  }
},);

    
  
    
    
if(token && role=="buyer"){
    return(
        <div className=''>
            <Navbar />
            <BookList/>
        </div>
    )
}
else if(token && role=="seller"){
  return (
    <div>
      <Navbar />
      <SellerDashboard/>
      
    </div>
  )
}

  else if (token && role=="admin"){
    return (
    <div>
      <Navbar />
      <Dashboard/>
      
    </div>
  )
  }
  
}

export default Home
