import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Валидация на фронтенде
      if (!product.name || !product.price || !product.stock) {
        setSnackbar({
          open: true,
          message: 'Заполните все обязательные поля',
          severity: 'error'
        });
        return;
      }

      console.log('Sending product data:', product); // Добавляем логирование

      const productData = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock)
      };

      const response = await api.createProduct(productData);
      console.log('Server response:', response.data); // Логируем ответ сервера

      setSnackbar({
        open: true,
        message: 'Товар успешно добавлен',
        severity: 'success'
      });
      
      setProduct({
        name: '',
        price: '',
        description: '',
        stock: '',
        image: ''
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error details:', error.response?.data); // Подробности ошибки
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.errors?.[0]?.msg
        || 'Ошибка при добавлении товара';
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Добавить новый товар
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="name"
            label="Название товара"
            value={product.name}
            onChange={handleChange}
            required
            fullWidth
            helperText="От 2 до 100 символов"
          />
          <TextField
            name="price"
            label="Цена"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0, step: "0.01" }}
            helperText="Должна быть больше 0"
          />
          <TextField
            name="description"
            label="Описание"
            multiline
            rows={4}
            value={product.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="stock"
            label="Количество на складе"
            type="number"
            value={product.stock}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            name="image"
            label="URL изображения"
            value={product.image}
            onChange={handleChange}
            fullWidth
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
          >
            Добавить товар
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddProduct; 