import styled from "styled-components";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { LoadingSpinner } from "./LoadingSpinner";

export const MultipleProducts = () => {

    // Use the category defined in the url to inform the server of the category to fetch
    const { category } = useParams();

    // Set the items when the items are fetched so that they can be mapped over
    const [categoryItems, setCategoryItems] = useState([]);

    // Show loading spinner while data is being fetched.
    // Loading spinner appears when set to true & disappears when set to false again.
    const [loader, setLoader] = useState(false);

    // Fetch items from the server based on the selected category
    useEffect(()=>{
        setLoader(true);
        fetch(`/items/categories/${category}`)
        .then((res)=> res.json())
        .then((data)=>{
            setCategoryItems(data.data);
            setLoader(false);
        })
        .catch((err) => {
            console.log("Error :", err);
        })
    },[category]);

    return (
        <Wrapper>
            <CategoryName><span style={{ fontWeight: "bold" }}>{category}</span>&nbsp;products</CategoryName>
            {loader === true && 
            <LoadingSpinner />}
            {loader === false && <CategoryList>
                {/* Functionality: Map over the category items fetched from the server and render each item separately */}
                {categoryItems && categoryItems.map((item) => {
                    return (
                        <CategoryListItem>
                            <StyledLink key={item._id} to={`/products/${item._id}`} >
                                <ItemDetails>
                                    <ItemImg src={item.imageSrc} />
                                    <Name>{item.name}</Name>
                                    <Price>{item.price}</Price>
                                </ItemDetails>
                            </StyledLink>
                        </CategoryListItem>
                    )})}
            </CategoryList>}
        </Wrapper>
    )
};

const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    margin-left: 20px;
    margin-right: 20px;
    align-self: center;
    justify-content: center;
`;

const CategoryName = styled.div`
    display: flex;
    border-top:2px solid #f5f5f5;
    border-bottom: 2px solid #f5f5f5;
    box-sizing: border-box;  
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 15px;
`;

const CategoryList = styled.ul`
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(275px, 0.25fr));
    gap:1.875rem;
    margin-top: 20px;
`;

const CategoryListItem = styled.li`
`;

const StyledLink = styled(Link)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-decoration: none;
    margin-top: 20px;
    padding: 20px;
    color:black;
    box-shadow: 0px 3px 12px rgba(0,0,0,0.15);
    transition: all 150ms ease-in-out;
    height: 225px;
    background: none;

    &:visited{
        color: black;
    }

    &:hover{
        transform: scale(1.05);
        opacity: 0.50;
    }
`;

const ItemImg = styled.img`
    width: 100px;
    height: 100px;
    align-self: center;
`;

const ItemDetails = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const Name = styled.p`
    padding: 10px 0px;
`;

const Price = styled.p`
`;
