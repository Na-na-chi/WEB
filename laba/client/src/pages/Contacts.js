import React from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Contacts() {
  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Контакты
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText
              primary="Телефон"
              secondary="+7 (999) 123-45-67"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary="info@shop.ru"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText
              primary="Адрес"
              secondary="г. Москва, ул. Примерная, д. 1"
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
}

export default Contacts; 