import { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Context } from './Context';
import { LoadingSpinner } from "./LoadingSpinner";

export const Homepage = () => {
    const {bodyProducts, location, all, setAll} = useContext(Context)
    const [target, setTarget] = useState("All");
    const [loading, setloading] = useState(false);
    
    // const stock = false
    // const [stock, setStock] = useState(false)
    // let stock = false
    const handleClick = (e) => {
        e.preventDefault()
        setTarget(e.target.innerHTML)
    }

    //adding "All" as a categories for body-location to show all items on landing page
    if (location?.length == 9) {
        location.unshift("All")
    };

    // Loading spinner will appear while data is being fetched from the server and disappear once the data has been retrieved.
    useEffect(() => {
        if (all?.length === 0) {
            setloading(true);
        } else if (all?.length > 0) {
            setloading(false);
        }
    }, [all]);
    
    return (
        <Wrapper>
            <Container>
                {location && location.map((location)=> {
                    return <Body key={location} 
                    onClick={handleClick}>{location}</Body>
                })} 
            </Container>
            {loading === true && <LoadingSpinner />}
            <Product>
            {target !== "All" && bodyProducts && 
                bodyProducts.map((product)=> {
                    let stock = product.numInStock >0 ? true : false
                    if (product.body_location === target) {
                        return (
                        <StyleLink key={product._id} to={`/products/${product._id}`}>
                            {stock == false && <Banner>Sold out</Banner>}
                            <Img src = {product.imageSrc}/>
                            <Name>{product.name}</Name>
                            <Price>{product.price}</Price>
                        </StyleLink>
                    )
                    }
                })}
            {target == "All" && all && 
            all.map((product)=> {
                let stock = product.numInStock >0 ? true : false
                    return (
                    <StyleLink key={product._id} to={`/products/${product._id}`}>
                        {stock == false && <Banner>Sold out</Banner>}
                        <Img src = {product.imageSrc}/>
                        <Name>{product.name}</Name>
                        <Price>{product.price}</Price>
                    </StyleLink>
                )
                }
            )}
            </Product>
        </Wrapper>
    )
}

const Banner = styled.p`
position:absolute;
text-align: center;
background-color: red;
height: 16px;
width: 70px;
color: white;
padding-top: 2px;
font-size: 11px;
font-weight: bold;
`
const Name = styled.p`
text-align:center;
margin-top: 15px;
margin-bottom: 10px;
`
const Price = styled.p`
text-align: center;
`
const Img = styled.img`
width: 100px;
height:100px;
align-self: center;`


const Product = styled.div`
display:grid;
grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
gap:1.875rem;
margin-top: 20px;
`

const Wrapper = styled.div`
display:flex;
flex-direction: column;
margin-left: 20px;
margin-right: 20px;
align-self: center;
justify-content: center;
`
const Container = styled.div`
display: flex;
border-top:2px solid #f5f5f5;
border-bottom: 2px solid #f5f5f5;
box-sizing: border-box;  
margin-top: 20px;
`

const Body = styled.button`
padding: 10px 20px;
cursor: pointer;
border: none;
background-color: transparent;
&:focus{
    border-bottom: 2px solid black;
    padding-bottom: 8px
}
&:hover{
    border-bottom: 2px solid black;
    padding-bottom: 8px
}
`

const StyleLink = styled(Link)`
display: flex;
flex-direction: column;
text-decoration: none;
margin-top: 20px;
padding: 20px;
color:black;
box-shadow: 0px 3px 12px rgba(0,0,0,0.15);
transition: all 150ms ease-in-out;
    &:visited{
        color:black;
    }
    &:hover{
            transform:scale(1.05)
        }
`
