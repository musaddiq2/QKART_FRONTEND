import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setdebounceTimeout] = useState(0);
  // eslint-disable-next-line
  const [filteredProduct, setfilteredProduct] = useState([]);
  const [products, setproducts] = useState([]);
  const [isLoading, setloading] = useState(true);
  const [item, setItems] = useState([]);
  const token = localStorage.getItem("token");
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    setloading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setloading(false);
      setproducts(response.data);
      setfilteredProduct(response.data);
      return response.data;
    } catch (error) {
      setloading(false);
      const res = error.response;
      if (res && res.status === 500) {
        const errorMessage = res.data.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
      }
      return null;
    }
  };
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      enqueueSnackbar(
        "Could not fetch cart details. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await performAPICall();
      const cartData = await fetchCart(token);
      const cartDetails = generateCartItemsFrom(cartData, productsData);
      setItems(cartDetails);
    };

    onLoadHandler();

    // eslint-disable-next-line
  }, []);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setfilteredProduct(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setfilteredProduct([]);
        }
        if (error.response.status === 500) {
          const errorMessage = error.response.data.message;
          enqueueSnackbar(errorMessage, { variant: "error" });
          setfilteredProduct(products);
        }
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    setdebounceTimeout(timeout);
  };

  const isItemInCart = (items, productId) => {
    const exists = items.find((item) => item.productId === productId);
    return !!exists;
  };
  const updateCartItem = (cartData, productsData) => {
    const cartItems = generateCartItemsFrom(cartData, productsData);
    setItems(cartItems);
  };
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      //console.log("addToCart API Response:", response);
      // Assuming updateCartItem updates the cart on the frontend
      updateCartItem(response.data, products);
    } catch (e) {
      if (e.error) {
        const errorMessage = e.response.data.message;
        enqueueSnackbar(errorMessage, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not add Item to the cart. Check the backend console for more details",
          {
            variant: "error",
          }
        );
        return;
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
        name="search"
      />
      <Grid container>
        <Grid
          item
          xs={12}
          md={token && products.length ? 9 : 12}
          className="product-grid"
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid container marginY="1rem" padding="1rem" spacing={2}>
              {filteredProduct.length ? (
                filteredProduct.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={async () => {
                        await addToCart(token, item, products, product._id, 1, {
                          preventDuplicate: true,
                        });
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4>No Products Found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {token ? (
          <Grid item xs={12} md={3}>
            <Cart
              items={item}
              products={products}
              handleQuantity={addToCart}
              hasCheckoutButton={true}
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
