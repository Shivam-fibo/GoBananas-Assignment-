import React, { useState, useEffect } from 'react';
import { Container, TextField, List, ListItem, CircularProgress, Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

function App() {
  // State variables to store the carts data, filtered products, search query, and loading status
  const [carts, setCarts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetch('https://dummyjson.com/carts')
      .then(response => response.json())
      .then(data => {
        // Flatten the nested product arrays from all carts into a single array
        const allProducts = data.carts.flatMap(cart => cart.products);
        setCarts(data.carts); // Store the raw carts data
        setFilteredProducts(allProducts); // Initialize the filtered products with all products
        setLoading(false); // Set loading to false once data is fetched
      });
  }, []);

  // Update the filtered products whenever the search query or carts data change
  useEffect(() => {
    const allProducts = carts.flatMap(cart => cart.products); // Flatten the product arrays again
    setFilteredProducts(
      allProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) // Filter products based on the search query
      )
    );
  }, [search, carts]); // Dependencies: search query and carts data

  // Handle changes in the search input field
  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update the search state with the new input value
  };

  return (
    <Container>
      <h1>Product List</h1>
      {/* Search input field */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
      />
      {loading ? (
        // Show a loading spinner while data is being fetched
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <CircularProgress />
        </Grid>
      ) : (
        // Display the list of filtered products
        <List>
          {filteredProducts.map(product => (
            <ListItem key={product.id}>
              {/* Card component to display product details */}
              <Card sx={{ display: 'flex', margin: '10px', width: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 150 }}
                  image={product.thumbnail}
                  alt={product.title}
                />
                <CardContent>
                  <Typography component="div" variant="h5">
                    {product.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    Quantity: {product.quantity}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    Total: ${product.total.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    Discounted Total: ${product.discountedTotal.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
