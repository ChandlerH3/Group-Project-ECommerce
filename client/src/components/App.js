import { BrowserRouter, Routes, Route} from "react-router-dom";
import Cart from "./Cart";

import GlobalStyles from './GlobalStyles';
import Header from "./Header";
import { Homepage } from './Homepage';
import { SingleProduct } from "./SingleProduct";
import { MultipleProducts } from "./MultipleProducts";
import { Checkout } from "./Checkout";
import { Confirmation } from "./Confirmation";


function App() {
  return (
    <>   
    <BrowserRouter>
      <Header /> 
      <GlobalStyles />
      <Routes>
        <Route exact path="/" element={<Homepage/>}></Route>
        <Route path="/products/:id" element={<SingleProduct/>}></Route>
        <Route path="/categories/:category" element={<MultipleProducts/>}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/checkout' element={<Checkout />}></Route>
        <Route path='/confirmation/:confirmationId' element={<Confirmation />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
  
}

export default App;
