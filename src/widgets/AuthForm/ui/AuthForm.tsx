"use client";

import { useState } from 'react';
import { useAuth } from '../model/useAuth';
import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const { login, register, loginAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Показываем модальное окно вместо попытки авторизации
    setShowBlockModal(true);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  const handleCloseModal = () => {
    setShowBlockModal(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" component="h2" textAlign="center">
          {isRegistering ? "Регистрация" : "Вход"}
        </Typography>
        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}
        >
          {isRegistering && (
            <TextField
              label="Имя"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isRegistering ? "Зарегистрироваться" : "Войти"}
          </Button>
        </form>

        <Button
          onClick={handleGuestLogin}
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
        >
          Войти как гость
        </Button>

        <Button
          onClick={() => setIsRegistering(!isRegistering)}
          variant="text"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
        >
          {isRegistering
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </Button>
      </Box>

      {/* Модальное окно блокировки авторизации */}
      <Dialog open={showBlockModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Блокировка авторизации
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            В текущей конфигурации ПО ваше действие не предусмотрено настройками безопасности. 
            Совершите вход через гостевой режим.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Понятно
          </Button>
          <Button onClick={() => {
            handleCloseModal();
            handleGuestLogin();
          }} variant="contained" color="primary">
            Войти как гость
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AuthForm;
