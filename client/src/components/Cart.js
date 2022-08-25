import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import gif from '../assets/cart.gif';
import CartItem from "./CartItem";

const Cart = () => {
  const navigate = useNavigate();

  // will store products user placed in cart
  const [cartItems, setCartItems] = useState([]);

  // Show loading spinner while data is being fetched.
  // Loading spinner appears when set to true & disappears when set to false again.
  const [loader, setLoader] = useState(false);

  //fetching products that user added to cart from mongodb via query params
  useEffect(() => {
    setLoader(true);
    fetch("/cart-items")
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.data[0].items);
        setLoader(false);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, []);

  // will push user to checkout page
  function Purchase() {
    navigate("/checkout");
  }
  return (
    <>
      {/* rendering cart page only when user has added item to cart */}
      {loader && (
        <Load>
          <LoadingSpinner />
        </Load>
      )}
      {!loader && (
        <>
          {cartItems.length != 0 && (
            <Wrapper>
              <Container>
                <Product>Product</Product>
                <Price>Price</Price>
                <Quantity>Quantity</Quantity>
                <Total>Total</Total>
              </Container>
              <Line />
              {/* mapping over each item in cart  and sending it to cartItems  */}
              {cartItems?.map((item, index) => {
                return <CartItem key={`${item}${index}`} cart={item} />;
              })}
              <Div>
                <Checkout type="submit" onClick={Purchase}>
                  Checkout
                </Checkout>
              </Div>
            </Wrapper>
          )}
          {cartItems.length == 0 && (
            <>
              <EmptyCart>OOPS your cart is empty continue shopping!
                <Gif src={gif}/>
                 </EmptyCart>
            </>
          )}
        </>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Div = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;
const Load = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;
const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  color: grey;
  text-align: center;
  font-size: xx-large;
  padding: 24px;
`;
const Container = styled.div`
  display: flex;
  color: grey;
  font-size: xx-large;
  justify-content: space-between;
  padding: 24px;
`;
const Product = styled.div`
  width: 65%;
`;
const Price = styled.div``;

const Quantity = styled.div``;

const Total = styled.div``;

const Line = styled.div`
  border: 0.5px solid lightgray;
  width: 100%;
`;
const Checkout = styled.button`
  font-size: 20px;
  border-radius: 20px;
  background-color: black;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 10px;
  width: 10%;
  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`;

const Gif = styled.img`
padding: 10px;
`;
export default Cart;
