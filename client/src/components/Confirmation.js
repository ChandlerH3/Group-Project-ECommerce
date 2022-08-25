import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { LoadingSpinner } from "./LoadingSpinner";

export const Confirmation = () => {

    const { confirmationId } = useParams();
    const [purchaseConfirmation, setPurchaseConfirmation] = useState();
    const [items, setItems] = useState([]);
    const [dateStamp, setDateStamp] = useState();

    // Show loading spinner while data is being fetched.
    // Loading spinner appears when set to true & disappears when set to false again.
    const [loader, setLoader] = useState(false);

    useEffect(()=>{
        setLoader(true);
        fetch(`/purchases/${confirmationId}`)
        .then((res)=> res.json())
        .then((data)=>{
            setPurchaseConfirmation(data.data);
            setLoader(false);
        })
        .catch((err) => {
            console.log("Error :", err);
        })
    },[confirmationId]);

    // Retrieve & access items from the cart + format purchase date
    useEffect(() => {
        if (purchaseConfirmation) {
            const str = purchaseConfirmation?.timeStamp;
            setItems(purchaseConfirmation.items);
            setDateStamp(str?.slice(0, 10));
        }
    }, [purchaseConfirmation]);

    return (
        <Wrapper>
            {loader === true && <LoadingSpinner />}
            {loader == false && <Container>
            {purchaseConfirmation && <Statement>Purchase confirmed</Statement>}
            <Title>Order details</Title>
            <Information>
                {purchaseConfirmation && <OrderListItem><p>Order number: #{purchaseConfirmation._id}</p></OrderListItem>}
                {purchaseConfirmation && <OrderListItem><p>First name: {purchaseConfirmation.firstName}</p></OrderListItem>}
                {purchaseConfirmation && <OrderListItem><p>Last name: {purchaseConfirmation.lastName}</p></OrderListItem>}
                {purchaseConfirmation && <OrderListItem><p>Postal code: {purchaseConfirmation.postalCode}</p></OrderListItem>}
                {dateStamp && <OrderListItem><p>Date: {dateStamp}</p></OrderListItem>}
                {purchaseConfirmation && <OrderListItem><p>Order status: confirmed</p></OrderListItem>}
            </Information>
            {purchaseConfirmation && <PurchasedItems>
                <Title>Item(s): </Title>
                {items?.length > 0 && <ListOfItems>{items?.map((item, index) => {
                    const num = index + 1;
                    return (
                        <Item>
                                <p>{num}.</p>
                                <ItemDescription>
                                    <ItemImg src={item.imageSrc} />
                                    <ItemName>{item.name}</ItemName>
                                    <ItemPrice>Price: {item.price}</ItemPrice>
                                    <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                                </ItemDescription>
                        </Item>)
                })}</ListOfItems>}
                <Total><h2>Total:</h2>${purchaseConfirmation.total}</Total>
            </PurchasedItems>}
            </Container>}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    margin-left: 20px;
    margin-right: 20px;
    align-self: center;
    justify-content: center;
    font-size: 17px;
`;

const Container = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    width: 80vh;
`;

const Statement = styled.h1`
    display: flex;
    font-size: 24px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 30px;
    align-self: center;
`;

const Information = styled.ul`
    padding-top: 10px;
`;

const PurchasedItems = styled.div`
`;

const ListOfItems = styled.ul`
`;

const OrderListItem = styled.li`
    padding-bottom: 20px;
`;

const Title = styled.h2`
    border-top: 2px solid #f5f5f5;
    padding: 10px 0px;
    font-size: 20px;
`;

const Item = styled.li`
    padding: 20px;
    padding-right: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #e1dbd64f;
`;

const ItemDescription = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 300px;
    text-align: center;
`;

const ItemImg = styled.img`
    height: 100px;
    align-self: center;
    padding-bottom: 10px;
`;

const ItemName = styled.p`
    padding-bottom: 10px;
`;

const ItemPrice = styled.p`
    padding-bottom: 10px;
`;

const ItemQuantity = styled.p`
    padding-bottom: 10px;
`;

const Total = styled.div`
    display: flex;
    border-top: 2px solid #f5f5f5;
    padding: 10px 0px;
    font-size: 20px;
    padding-bottom: 20px;
    width: 100%;
    justify-content: space-between;
`;