import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import pic from '../assets/logo.png'
import { FiShoppingCart,FiChevronLeft,FiX } from "react-icons/fi";


const Header = () => {

    // Categories are set when the data is successfully fetched from the server
    const [category, setCategory] = useState([]);

    // Categories will appear when the arrow icon is clicked by the user.
    const [open, setOpen] = useState(false);

    // Cart will be set to get length of cart so we can display how many items user has in cart
    const [cart, setCart] = useState([]);

    // Fetch categories from the server upon render
    useEffect(()=>{
        fetch("/items/categories")
            .then((res)=> res.json())
            .then((data)=>{
                setCategory(data.data)
            })
            .catch((error)=>{
                console.log(error)
        })
    },[]);

    //fetching number of items in cart then setting it to a usestate
  useEffect(()=>{
    fetch("/cart-items")
    .then((res)=> res.json())
    .then((data)=>{
        setCart((data.data[0].items));
    }).catch((err) => {
        console.log("Error :", err);
      });
})
    return (
    <>
    <Nav>
        <NavLink to='/'><Logo src={pic} /></NavLink>
        <NavMenue>
            {/* setting category icon to open and close on user click */}
            {
                <ul>
                    <P onClick={() => (setOpen(!open))}>
                        {!open && <FiChevronLeft/> }
                        {open && <FiX/>}
                    </P>
                </ul>
            } 
            {/* mapping over categories are dynamically rendring when user opens categories */}
            {open && 
                category?.map((items)=>{
                return <Categories><NavLink to={`/categories/${items}`}activeStyles>{items}</NavLink></Categories>})
            }
        <NavLink to='/cart' activeStyles>
            {/*cart items will only display when user adds an item  */}
            {cart.length!=0 && <><FiShoppingCart/><CartNum>{cart.length}</CartNum></>}
             {cart.length==0 &&<FiShoppingCart/>}
        </NavLink>
        </NavMenue>
    </Nav>
    </>
    )
}

const Nav = styled.nav`
    margin: 0;
    padding: 0;
    height: 200px;
    display: flex;
    background-color: #e1dbd7;
    justify-content: space-between;
    z-index: 10;
`;

const Categories = styled.div`
`;
const CartNum = styled.div`
position: absolute;
top: 80px;
margin-left: 15px;
`;
const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 20px;
    text-decoration: none;
    color: black;
    cursor: pointer;

    &:hover{
        color: white;
        transition: 0.5s;
    }

    &.active{
        color: white;
    }
`;

const NavMenue = styled.div`
    margin-right: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: large;
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;

    &:hover {
        opacity: 0.75;
    }
`;

const P = styled.p`
    padding: 20px;

    &:hover{
        cursor: pointer;
        color: white;
        transition: 0.5s;
    }
`;

export default Header;