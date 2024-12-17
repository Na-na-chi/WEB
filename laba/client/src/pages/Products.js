import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useCart } from '../context/CartContext';
import api from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const { addToCart } = useCart();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при загрузке товаров',
        severity: 'error'
      });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: 'Товар добавлен в корзину',
      severity: 'success'
    });
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteProduct(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setSnackbar({
        open: true,
        message: 'Товар успешно удален',
        severity: 'success'
      });
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при удалении товара',
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock)
    });
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    try {
      await api.updateProduct(editingProduct.id, editingProduct);
      setProducts(products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      setSnackbar({
        open: true,
        message: 'Товар успешно обновлен',
        severity: 'success'
      });
      setEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Ошибка при обновлении товара:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при обновлении товара',
        severity: 'error'
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStock = stockFilter === 'all' || 
        (stockFilter === 'inStock' && product.stock > 0) ||
        (stockFilter === 'outOfStock' && product.stock === 0);
      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price;
      if (priceSort === 'desc') return b.price - a.price;
      return 0;
    });

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Поиск"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
          />
          <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              label="Сорт��ровка"
            >
              <MenuItem value="">По умолчанию</MenuItem>
              <MenuItem value="asc">Сначала дешевые</MenuItem>
              <MenuItem value="desc">Сначала дорогие</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
            <InputLabel>Наличие</InputLabel>
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              label="Наличие"
            >
              <MenuItem value="all">Все товары</MenuItem>
              <MenuItem value="inStock">В наличии</MenuItem>
              <MenuItem value="outOfStock">Нет в наличии</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>{product.description}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {product.price} ₽
                </Typography>
                <Typography color="text.secondary">
                  В наличии: {product.stock}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
                </Button>
                <Box>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы действительно хотите удалить товар "{productToDelete?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Редактировать товар</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Название товара"
              value={editingProduct?.name || ''}
              onChange={handleEditChange}
              fullWidth
              required
            />
            <TextField
              name="price"
              label="Цена"
              type="number"
              value={editingProduct?.price || ''}
              onChange={handleEditChange}
              fullWidth
              required
              inputProps={{ min: 0, step: "0.01" }}
            />
            <TextField
              name="description"
              label="Описание"
              value={editingProduct?.description || ''}
              onChange={handleEditChange}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              name="stock"
              label="Количество на складе"
              type="number"
              value={editingProduct?.stock || ''}
              onChange={handleEditChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              name="image"
              label="URL изображения"
              value={editingProduct?.image || ''}
              onChange={handleEditChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleEditConfirm} color="primary" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
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

export default Products; 