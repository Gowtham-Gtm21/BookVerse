
import './App.css'
import AddBook from './components/AddBook'
import BookList from './components/BookList'
import BuyNowForm from './components/BuyNowForm'
import Cart from './components/Cart'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import Login from './components/Login'
import Myorders from './components/Myorders'
import MyProduct from './components/MyProduct'

import Navbar from './components/Navbar'
import Register from './components/Register'
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import UserList from './components/UserList'
import SellerList from './components/SellerList'
import SellerDashboard from './components/SellerDashboard'
import SellerOrders from './components/SellerOrders'

function App() {
 

  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>

<Route  path='/' element={<Login/>}></Route>
<Route  path='/register' element={<Register/>}></Route>
<Route path="/home" element={<Home/>}></Route>
<Route path="/dashboard" element={<Dashboard/>}></Route>
<Route path ="/books" element={<BookList/>}></Route>
<Route path ="/cart/:id" element={<Cart/>}></Route>
<Route path ="/Myorders" element={<Myorders/>}></Route>
<Route path ="/buy" element={<BuyNowForm/>}></Route>
<Route path ="/addbook" element={<AddBook/>}></Route>
<Route path ="/seller-product/:sellerId" element={<MyProduct/>}></Route>
<Route path ="/users" element={<UserList/>}></Route>
<Route path ="/sellers" element={<SellerList/>}></Route>
<Route path ="/seller-dash" element={<SellerDashboard/>}></Route>
<Route path ="/sellerOrder" element={<SellerOrders/>}></Route>
    </Routes>
    
    </BrowserRouter>
   


    
    </>
  )
}

export default App
{/* <Login/> */}
    {/* <Navbar/> */}
    {/* <Register/> */}
    // <BookList/>
      {/* <AddBook/> */}