import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component="img" image={product.image} alt={product.name} />
      <CardContent>
        <Typography>
          {product.name}
        </Typography>
        <Typography paddingY={"0.5rem"} fontWeight="700">
          ${product.cost}
        </Typography>
        <Rating defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button className="card-button"
        fullWidth
        startIcon={<AddShoppingCartOutlined/>}
        onClick={handleAddToCart}
        >Add To Cart</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
