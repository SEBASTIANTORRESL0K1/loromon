import { useState } from 'react';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import { Logout, EmojiEvents } from '@mui/icons-material';
import { Usuario } from '../services/api';

interface ProfileScreenProps {
  onLogout: () => void;
  user: Usuario;
}

const capturedLoromons = [
  { id: 'loromon-1', name: 'Ingeniero LoroMon', rarity: 3, emoji: '👷' },
  { id: 'loromon-2', name: 'Doctor LoroMon', rarity: 4, emoji: '👨‍⚕️' },
  { id: 'loromon-3', name: 'Abogado LoroMon', rarity: 2, emoji: '👨‍⚖️' },
  { id: 'loromon-4', name: 'Economista LoroMon', rarity: 3, emoji: '💼' },
  { id: 'loromon-5', name: 'Científico LoroMon', rarity: 5, emoji: '🔬' },
  { id: 'loromon-6', name: 'Artista LoroMon', rarity: 2, emoji: '🎨' },
];

const rankingData = [
  { id: 'rank-1', username: 'ProGamer123', points: 3450, avatar: 'P' },
  { id: 'rank-2', username: 'LoroMaster', points: 3200, avatar: 'L' },
  { id: 'rank-3', username: 'CaptureKing', points: 2890, avatar: 'C' },
  { id: 'rank-5', username: 'NewbieHunter', points: 980, avatar: 'N' },
];

export function ProfileScreen({ onLogout, user }: ProfileScreenProps) {
  const [currentTab, setCurrentTab] = useState(0);

  const getRarityStars = (rarity: number) => '⭐'.repeat(rarity);

  // Mezclamos al usuario real con el ranking simulado
  const fullRanking = [...rankingData, { 
    id: 'user-rank', 
    username: user.nombre_usuario, 
    points: user.puntos || 0, 
    avatar: user.nombre_usuario[0].toUpperCase() 
  }].sort((a, b) => b.points - a.points);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 10, // Espacio para la navegación inferior
      }}
    >
      {/* Cabecera - Perfil */}
      <Card
        elevation={0}
        sx={{
          p: 4,
          pt: 6,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              width: 80,
              height: 80,
              fontSize: '2.5rem',
              fontWeight: 800,
              border: '4px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {user.nombre_usuario[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>
              {user.nombre_usuario}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Entrenador LoroMon • Nivel 1
            </Typography>
            <Chip
              icon={<EmojiEvents sx={{ color: 'white !important' }} />}
              label={`${user.puntos || 0} puntos totales`}
              size="small"
              sx={{
                mt: 1.5,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          </Box>
        </Box>
      </Card>

      {/* Pestañas */}
      <Box sx={{ px: 2, mt: -2 }}>
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Inventario" sx={{ fontWeight: 700, py: 2 }} />
            <Tab label="Ranking" sx={{ fontWeight: 700, py: 2 }} />
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {/* Inventario Tab */}
          {currentTab === 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {capturedLoromons.map((loromon) => (
                <Paper
                  key={loromon.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '3rem', mb: 1 }}>{loromon.emoji}</Box>
                  <Typography variant="subtitle2" fontWeight="700" noWrap>
                    {loromon.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getRarityStars(loromon.rarity)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {/* Ranking Tab */}
          {currentTab === 1 && (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 3, elevation: 1 }}>
              {fullRanking.map((player, index) => (
                <ListItem
                  key={player.id}
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: index < fullRanking.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    bgcolor: player.username === user.nombre_usuario ? 'primary.50' : 'transparent',
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 40,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {index < 3 ? (
                      <EmojiEvents
                        sx={{
                          color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                          fontSize: 32,
                        }}
                      />
                    ) : (
                      <Typography variant="h6" color="text.secondary" fontWeight="700">
                        #{index + 1}
                      </Typography>
                    )}
                  </Box>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                      {player.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="700">
                        {player.username}
                        {player.username === user.nombre_usuario && " (Tú)"}
                      </Typography>
                    }
                    secondary={`${player.points} puntos`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Botón de cerrar sesión */}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Logout />}
          onClick={onLogout}
          sx={{
            mt: 6,
            py: 1.5,
            borderRadius: 3,
            borderWidth: 2,
            fontWeight: 700,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
}
