import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import styled from "styled-components"
import { useNavigate } from "react-router-dom";

export const Checkout = () => {
    const [cartItems, setCartItems] = useState()
    const [fName, setFName] = useState()
    const [lName, setLName] = useState()
    const [card, setCard] = useState()
    const [exp, setExp] = useState()
    const [po, setPo] = useState()
    //state set up for error
    const [errorStatus, setErrorStatus] = useState(false)
    const [errorM, setErrorM] = useState()

    let navigate = useNavigate();
    
    //array of items.quantity x items.price
    const totalArray  = cartItems?.map((item) =>{
            return item.quantity * Number(item.price.slice(1))
        } )
    
    //sum of numbers in totalArray
    const total = totalArray ? totalArray.reduce((a,b) => a+b, 0) : 0
    const totalPrice = Math.round(total * 100) / 100

    //fetch items in cart
    useEffect(()=>{
        fetch("/cart-items")
        .then((res)=> res.json())
        .then((data)=>{
            setCartItems(data.data[0].items)
        })
    },[])

    const handleError = (e) => {
        e.preventDefault()    
        if ( fName?.length !== true && lName?.length !== true && card?.length !== true && exp?.length !== true && po?.length !== true ) {
            setErrorStatus(true)
            setErrorM("Please enter your information.")
        }
        if (po?.length  && fName?.length  && lName?.length  && card?.length === 16 && exp?.length) {
            setErrorStatus(false)
        }
    }
    const handleSubmit = (e) => {
        let current = new Date()
        e.preventDefault()
        fetch("/purchases/new-purchase", {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            total: totalPrice,
            firstName: fName,
            lastName: lName,
            creditCardNum: card,
            creditCardExp: exp,
            postalCode: po,
            timeStamp: current
            })
            })
        .then(res => {
            if (res?.ok) {
                return res.json();
            } 
            })
        .then(data => {
            navigate(`/confirmation/${data.data._id}`)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }   

    return (
        <Wrapper>
            <CheckoutDetails>
                <h3 style={{fontWeight: "bold", fontSize: "16px", marginBottom: "1rem"}}>CHECKOUT</h3>
                <>
                    <p>First Name</p>
                    <Input type="text" name="fname" style={{marginBottom: "1rem"}} onChange={(e)=> {setFName(e.target.value)}} />
                </>
                <>
                    <p>Last Name</p>
                    <Input type="text" name="lname" style={{marginBottom: "1rem"}} onChange={(e)=> {setLName(e.target.value)}} />
                </>
                <>
                    <p>Card Number</p>
                    <Input type="number" name="card_number" style={{marginBottom: "1rem"}} onChange={(e)=> {setCard(e.target.value)}} />
                </> 
                <Card>
                    <div style={{display:"flex", alignItems: "center"}}>
                        <p>EXP</p>
                        <Input style={{width: "50%", marginLeft:"10px"}} label="Expiration Date" type="month" name="exp_date" onChange={(e)=> {setExp(e.target.value)}} />
                    </div>
                    <div style={{display:"flex", alignItems: "center"}}> 
                        <p>Postal Code</p>
                        <Input style={{width: "40%", marginLeft:"10px"}} type="text" name="postal_code" onChange={(e)=> {setPo(e.target.value)}} />
                    </div>
                </Card>
                {po?.length  && fName?.length  && lName?.length  && card?.length === 16 && exp?.length ? 
                <Button onClick={handleSubmit}>PLACE ORDER</Button> : 
                <DisabledB onClick={handleError}> PLACE ORDER</DisabledB>
                }
                {errorStatus && <Error>{errorM}</Error>}
            </CheckoutDetails>
            <Cart>
                <Item>
                    <h3 style={{fontWeight: "bold", fontSize: "16px", marginBottom: "1rem"}}>CART</h3>
                    <p style={{display: "flex", alignItems:"center", fontWeight: "bold"}}><FiShoppingCart /><span style={{marginLeft:"5px"}}>{cartItems?.length}</span></p>
                </Item>
                <>
                    {cartItems && cartItems.map((item) => {
                        return (
                            <Item key={item._id}>
                                <Img src={item.imageSrc}/>
                                <div>{item.price} x {item.quantity}</div>
                            </Item>
                        )
                    })}
                        <Span></Span>
                        <Total>
                            <p style={{fontWeight: "bold", fontSize: "16px"}}>TOTAL</p>
                            <p style={{fontWeight: "bold", fontSize: "16px"}}>{totalPrice}</p>
                        </Total>
                </>
            </Cart>
        </Wrapper>
    )
}
const Error = styled.div`
text-align:center;
color: red;
`
const Input = styled.input`
border: none;
border-bottom: 1.5px solid #ccc;
outline: none;
padding:5px;
 &:-internal-autofill-selected{
    background-color: transparent !important;
 }
`
const DisabledB = styled.button`
color: #ccc;
background-color: #e7e7e7;
padding:10px;
text-align: center;
border-radius: 8px;
width:100%;
font-size:16px;
border:none;
letter-spacing: 1px;
`
const Button = styled.button`
color: white;
background-color: black;
padding:10px;
text-align: center;
border-radius: 8px;
width:100%;
font-size:16px;
letter-spacing: 1px;
transition: all 150ms ease-in-out;
cursor: pointer;
    &:active{
        transform: scale(0.9);
    }
`

const Wrapper = styled.div`
display: flex;
justify-content: center;
margin-top:2rem;
letter-spacing: 1px;
`
const Cart = styled.div`
display:flex;
flex-direction: column;
margin: 4rem;
`
const Item = styled.div`
display:flex;
justify-content: space-between;
align-items: center;
width: 20rem;
margin-bottom: 1rem;
`
const Img = styled.img`
width: 100px;
padding: 15px 15px;
`

const Total = styled.div`
display:flex;
justify-content: space-between;
`
const Span = styled.div`
border-top:1px solid black;
margin-top: 1rem;
margin-bottom: 1rem;
`
const Card = styled.div`
display: flex;
justify-content: space-around;
align-items: center;
margin-bottom: 1rem;
margin-top: 1rem;
`
const CheckoutDetails = styled.form`
display:grid;
grid-gap: 1rem;
margin: 4rem;
`