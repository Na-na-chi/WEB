import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  styled,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import Badge from '@mui/material/Badge';

const useStyles = styled((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: theme.spacing(2),
  },
}));

function Navbar() {
  const classes = useStyles();
  const { cartItems } = useCart();
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Магазин
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Товары
        </Button>
        <Button color="inherit" component={RouterLink} to="/add-product">
          Добавить товар
        </Button>
        <Button color="inherit" component={RouterLink} to="/orders">
          Заказы
        </Button>
        <Button color="inherit" component={RouterLink} to="/contacts">
          Контакты
        </Button>
        <Button
          color="inherit"
          component={RouterLink}
          to="/cart"
          startIcon={
            <Badge badgeContent={cartItemsCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          }
        >
          Корзина
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 