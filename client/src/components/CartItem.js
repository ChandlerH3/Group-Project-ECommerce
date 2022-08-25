import styled from "styled-components";
import { FiX } from "react-icons/fi";

const CartItem = ({cart}) => {
  //Fucntion will remove cart item from backend and front end, then refresh page
  const removeItem = () => {
    fetch("/cart-items", {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        productId: cart._id,
      }),
    }).then(() => {
       window.location.reload();
     }).catch((err) => {
      console.log("Error :", err);
    });
  };
  
  return (
    <Wrapper>
      <Content>
        {/* icon on click will trigger function to remove item from cart */}
        <P onClick={removeItem}>
          <FiX />
        </P>
        <ProductImg src={cart.imageSrc} />
        <h2>{cart.name}</h2>
        <Price>{cart.price}</Price>
        <Quantity>{cart.quantity}</Quantity>
        {/* will remove $ from the price and turn it into a int then multiply by quantity */}
        <Total>
          ${parseFloat(cart.price.substring(1)) * cart.quantity}
        </Total>
      </Content>
      <Line />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: sans-serif;
  font-size: x-large;
  color: black;
`;
const Line = styled.div`
  border: 0.5px solid lightgray;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px;
`;
const ProductImg = styled.img`
  width: 200px;
  height: 150px;
`;
const Price = styled.div``;
const Total = styled.div``;
const Quantity = styled.div``;
const P = styled.div`
  padding: 20px;

  &:hover {
    cursor: pointer;
    color: red;
    transition: 0.5s;
  }
`;

export default CartItem;
