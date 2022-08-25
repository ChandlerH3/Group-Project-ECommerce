import styled from "styled-components"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useContext } from "react"
import { Context } from "./Context"
import { LoadingSpinner } from "./LoadingSpinner";

export const SingleProduct = () => {
    const [quantity, setQuantity] = useState(0)
    const {id} = useParams()
    const [add, setAdd] = useState(false)
    const {bodyProducts, company, idArray, setIdArray, quantityArray, setQuantityArray} = useContext(Context)
    const [loading, setloading] = useState(false);

    //increase purchase quantity
    const increase = () => {
        setQuantity(quantity + 1)
    }

    //decrease purchase quantity
    const decrease = () => {
        quantity >= 1 &&
        setQuantity(quantity - 1)
    }
    
    //store purchase info in sessionStorage when adding to cart
    const handleAddtoCart = () => {
        setIdArray([...idArray, id])
        setQuantityArray([...quantityArray, quantity])
        fetch("/cart-items", {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            productId: id,
            quantity: quantity
            }),
            })
        .then(res => {
            if (res?.ok) {
                setAdd(true)
                return res.json();
            } 
            })
        .catch((error) => {
            console.log("Error :", error);
        });
    }

    // Loading spinner useEffect till products info are loaded
    useEffect(() => {
        if (!bodyProducts) {
            setloading(true);
        } else if (bodyProducts?.length > 0) {
            setloading(false);
        }
    }, [bodyProducts]);

    return (
        <>
                {loading && <Loading><LoadingSpinner /></Loading>}
                {bodyProducts && 
                    bodyProducts.map((product) => {
                        if (product._id == id){
                            //locate company info using product's companyId
                            const companyIndex = company.find((company) => company._id == product.companyId)
                            return (
                                <ItemDescription key={product._id}>
                                    <ProductImage src = {product.imageSrc}/>
                                    <ItemDetailsBox>
                                        <Name>{product.name}</Name>
                                        <Price>{product.price}</Price>
                                        <Description>Description</Description>
                                        {product.numInStock > 0 && add === false? 
                                            <Quantity> 
                                                <Button>
                                                    <span style={{fontSize: "20px", cursor:"pointer"}} onClick={decrease}>-</span>
                                                    <Span>{quantity}</Span>
                                                    <span style={{fontSize: "20px", cursor:"pointer"}} onClick={increase}>+</span>
                                                </Button>
                                                {quantity > 0 && quantity <= product.numInStock  ? <Cart onClick={handleAddtoCart}>Add to Cart</Cart>
                                                : <DisabledB>Add to Cart</DisabledB>}
                                            </Quantity> :
                                            <DisabledCart>{add ? "Added" : "Out of stock"}</DisabledCart>
                                            }
                                        <Seller>
                                            <Company>Sold by: {companyIndex.name} in {companyIndex.country} </Company>
                                        </Seller>
                                    </ItemDetailsBox>
                                </ItemDescription>
                            )
                        }
                })}
            </>
    )
}

const Loading = styled.div`
display: flex;
margin-top: 100px;
justify-content: center;
`
const Company = styled.p`
margin-top:10px;
`
const DisabledB = styled.button`
color: #ccc;
background-color: #e7e7e7;
padding:10px;
text-align: center;
border-radius: 8px;
width:200px;
font-size:20px;
border:none;
`

const Span = styled.span`
margin-left: 10px;
margin-right: 10px;
font-size: 20px;
`

const Button = styled.button`
border-radius: 8px;
background-color: lightgrey;
border: 0;
padding: 10px;
margin-right: 20px;
`
const Quantity = styled.div`
display: flex;
flex-direction: row;
`
const ItemDescription = styled.div`
display: flex;
margin-top: 100px;
justify-content: space-evenly;
`
const ItemDetailsBox = styled.div`
display: flex;
flex-direction: column;
`
const Seller = styled.div`
display: flex;
font-size:20px;
margin-top: 20px;
margin-bottom: 20px;
`
const ProductImage = styled.img`
width: 350px;
`
const Cart = styled.p`
color: white;
background-color: black;
padding:10px;
text-align: center;
border-radius: 8px;
width:200px;
font-size:20px;
transition: all 150ms ease-in-out;
cursor: pointer;
    &:active{
        transform: scale(0.9);
    }
`
const DisabledCart = styled.p`
color: #ccc;
background-color: #e7e7e7;
padding:10px;
text-align: center;
border-radius: 8px;
width:200px;
font-size:20px;
border:none;
`

const Name = styled.p`
font-weight: bold;
font-size: 26px;
width: 500px;
`
const Price = styled.p`
font-size:24px;
margin-top: 20px;
margin-bottom: 20px;
`
const Description = styled.p`
font-style: italic;
margin-bottom: 20px;
font-size:20px;
`