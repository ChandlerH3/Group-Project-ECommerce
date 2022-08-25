import { useState, useEffect, createContext } from "react";

export const Context = createContext(null);
export const Provider = ({ children }) => {
    const [bodyProducts, setBodyProducts] = useState();
    const [location, setLocation] = useState();
    const [company, setCompany] = useState();
    const [category, setCategory] = useState([]);
    const [all, setAll] = useState([])
     //array created to store purchase ids
    const [idArray, setIdArray] = useState([])
    //array created to store purchase quantity
    const [quantityArray, setQuantityArray] = useState([])
    
    useEffect(()=>{
        fetch("/items")
        .then((res)=> res.json())
        .then((data)=>{
            setAll(data.data)
        })
    },[])
    useEffect(()=>{
        fetch("/companies")
        .then((res)=> res.json())
        .then((data)=>{
            setCompany(data.data)
        })
    },[])
    useEffect(()=>{
        fetch("/items/body_locations")
        .then((res)=> res.json())
        .then((data)=>{
            setLocation(data.data)
        })
    },[])
    useEffect(()=>{
        fetch("/items")
        .then((res)=> res.json())
        .then((data)=>{
            setBodyProducts(data.data)
        })
    },[])
    useEffect(()=>{
        fetch("/items/categories")
        .then((res)=> res.json())
        .then((data)=>{
            setCategory(data.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])
    return (
        <Context.Provider
        value={{
            bodyProducts,
            setBodyProducts,
            location,
            setLocation,
            company,
            setCompany,
            category,
            setCategory,
            idArray,
            setIdArray,
            quantityArray,
            setQuantityArray,
            all, 
            setAll
        }}
        >
        {children}
        </Context.Provider>
    );
    };