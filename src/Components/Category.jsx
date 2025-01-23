import Footer from "./Footer";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";

const Category = ({ token, setToken, numItemCart, active, setActive, setSearch, isAdmin }) => {

    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState(null);

    //-- API Calls
    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories", {
                method: "GET"
            })
            const userData = await response.json();
            console.log(userData);
            return userData;
        } catch (error) {
            console.error(error);

        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/product", {
                method: "GET"
            })
            const userData = await response.json();
            console.log(userData);
            return userData;
        } catch (error) {
            console.error(error);

        }
    }

    //-- on load
    useEffect(() => {
        async function getInfo() {
            const categoriesList = await fetchCategories();
            setCategories(categoriesList);
            const productsList = await fetchProducts();
            setProducts(productsList);
        }
        getInfo();
    }, [token])

    return (<>
        <NavBar
            token={token}
            setToken={setToken}
            numItemCart={numItemCart}
            active={active}
            setActive={setActive}
            setSearch={setSearch}
            isAdmin={isAdmin}
        />
        Category
        <Footer />
    </>);
}

export default Category;