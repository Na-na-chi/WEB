import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
      setSnackbar({
        open: true,
        message: 'Количество товара обновлено',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Недопустимое количество товара',
        severity: 'error'
      });
    }
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setSnackbar({
      open: true,
      message: 'Товар удален из корзины',
      severity: 'info'
    });
  };

  const handleCheckout = async () => {
    try {
      const order = {
        customerName: 'Покупатель',
        totalAmount: total,
        items: cartItems,
      };
      await api.createOrder(order);
      clearCart();
      setSnackbar({
        open: true,
        message: 'Заказ успешно оформлен!',
        severity: 'success'
      });
      navigate('/orders');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при оформлении заказа',
        severity: 'error'
      });
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Корзина
        </Typography>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Корзина пуста
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Перейти к покупкам
            </Button>
          </Box>
        ) : (
          <>
            <List>
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider />}
                  <ListItem sx={{ py: 2 }}>
                    <Avatar
                      src={item.image}
                      alt={item.name}
                      variant="rounded"
                      sx={{ mr: 2, width: 60, height: 60 }}
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.price} ₽ за шт.
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        sx={{ width: 60, mx: 1 }}
                        value={item.quantity}
                        type="number"
                        size="small"
                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                        inputProps={{ min: 1, max: item.stock }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body1" sx={{ minWidth: 80, textAlign: 'right' }}>
                      {item.price * item.quantity} ₽
                    </Typography>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveFromCart(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Итого: {total} ₽
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                size="large"
              >
                Оформить заказ
              </Button>
            </Box>
          </>
        )}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Cart; 