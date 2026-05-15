import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Logout, EmojiEvents } from '@mui/icons-material';
import { Usuario, RankingEntry, api, Personaje } from '../services/api';

interface ProfileScreenProps {
  onLogout: () => void;
  user: Usuario;
}

const rankingData: RankingEntry[] = [];

export function ProfileScreen({ onLogout, user }: ProfileScreenProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [rankingError, setRankingError] = useState<string | null>(null);
  
  const [characters, setCharacters] = useState<Personaje[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  const getRarityStars = (rarity: number | boolean) => {
    const stars = typeof rarity === 'number' ? rarity : (rarity ? 5 : 3);
    return '⭐'.repeat(stars);
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    setInventoryError(null);
    try {
      const lugares = await api.getLugares();
      // Extraemos todos los personajes (personaje1 y personaje2) de cada lugar
      const allCharacters: Personaje[] = [];
      lugares.forEach(lugar => {
        if (lugar.personaje1) allCharacters.push(lugar.personaje1);
        if (lugar.personaje2) allCharacters.push(lugar.personaje2);
      });
      
      // Eliminamos duplicados por ID de personaje
      const uniqueCharacters = Array.from(new Map(allCharacters.map(char => [char.id_personaje, char])).values());
      
      setCharacters(uniqueCharacters);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventoryError('No se pudo cargar el inventario.');
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchRanking = async () => {
    setLoadingRanking(true);
    setRankingError(null);
    try {
      const data = await api.getRanking();
      setRanking(data);
    } catch (error) {
      console.error('Error fetching ranking:', error);
      setRankingError('No se pudo cargar el ranking. Intente nuevamente.');
    } finally {
      setLoadingRanking(false);
    }
  };

  useEffect(() => {
    if (currentTab === 0) {
      fetchInventory();
    } else if (currentTab === 1) {
      fetchRanking();
    }
  }, [currentTab]);

  const fullRanking = [...ranking].sort((a, b) => b.puntos - a.puntos);
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        bgcolor: 'background.default',
        pb: 4,
      }}
    >
      {/* Cabecera - Perfil */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          pt: { xs: 'calc(16px + env(safe-area-inset-top))', sm: 5 },
          borderRadius: 0,
          bgcolor: '#6366f1',
          color: 'white',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            justifyContent: 'space-between',
            gap: { xs: 2.5, sm: 3 } 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, minWidth: 0 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: { xs: 70, sm: 90 },
                height: { xs: 70, sm: 90 },
                fontSize: { xs: '2rem', sm: '2.8rem' },
                fontWeight: 800,
                border: '4px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                flexShrink: 0
              }}
            >
              {user.nombre_usuario[0].toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography 
                variant="h4" 
                fontWeight="800" 
                sx={{ 
                  letterSpacing: -1, 
                  fontSize: { xs: '1.6rem', sm: '2.2rem' },
                  lineHeight: 1.1,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.nombre_usuario}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600, mb: 1, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Entrenador LoroMon
              </Typography>
              <Chip
                icon={<EmojiEvents sx={{ color: 'white !important', fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
                label={`${user.puntos || 0} pts`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 800,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  height: { xs: 26, sm: 28 },
                  fontSize: { xs: '0.8rem', sm: '0.85rem' }
                }}
              />
            </Box>
          </Box>

          {/* Botón de cerrar sesión rediseñado */}
          <Button
            variant="contained"
            onClick={onLogout}
            startIcon={<Logout />}
            fullWidth={{ xs: true, sm: false } as any}
            sx={{
              bgcolor: '#ffffff',
              color: 'primary.main',
              '&:hover': { 
                bgcolor: '#f8fafc',
                transform: 'translateY(-2px)' 
              },
              textTransform: 'none',
              borderRadius: 3,
              fontWeight: 700,
              px: { xs: 3, sm: 3 },
              py: { xs: 1.2, sm: 1 },
              fontSize: { xs: '0.9rem', sm: '0.9rem' },
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              minWidth: { xs: '100%', sm: 'fit-content' }
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Card>

      {/* Pestañas - Ya no tienen margen negativo para evitar solapamientos */}
      <Box sx={{ px: { xs: 1.5, sm: 2 }, mt: 2 }}>
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Inventario" sx={{ fontWeight: 700, py: 1.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
            <Tab label="Ranking" sx={{ fontWeight: 700, py: 1.5, fontSize: { xs: '0.8rem', sm: '0.875rem' } }} />
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {/* Inventario Tab */}
          {currentTab === 0 && (
            <Box>
              {loadingInventory && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              )}

              {inventoryError && (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'error.main' }}>
                  {inventoryError}
                </Typography>
              )}

              {!loadingInventory && !inventoryError && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, minmax(0, 1fr))',
                      sm: 'repeat(3, minmax(0, 1fr))',
                    },
                    gap: 2,
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {characters.length === 0 ? (
                    <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No has capturado ningún LoroMon todavía.
                      </Typography>
                    </Box>
                  ) : (
                    characters.map((character) => (
                      <Paper
                        key={character.id_personaje}
                        elevation={1}
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          textAlign: 'center',
                          borderRadius: 3,
                          transition: 'all 0.2s',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          minHeight: { xs: 140, sm: 160 },
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <Box sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, mb: 1 }}>👾</Box>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="700" 
                          noWrap 
                          title={character.nombre_personaje}
                          sx={{ 
                            width: '100%',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          {character.nombre_personaje}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {getRarityStars(character.es_especial)}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          display="block" 
                          color="primary" 
                          fontWeight="600"
                          sx={{ mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                        >
                          {character.valor_puntos} pts
                        </Typography>
                      </Paper>
                    ))
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Ranking Tab */}
          {currentTab === 1 && (
            <Box>
              {loadingRanking && (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Cargando ranking...
                </Typography>
              )}

              {rankingError && (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 6, color: 'error.main' }}>
                  {rankingError}
                </Typography>
              )}

              {!loadingRanking && !rankingError && (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 3, elevation: 1 }}>
                  {fullRanking.length === 0 ? (
                    <Typography variant="body2" sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                      No hay datos de ranking disponibles.
                    </Typography>
                  ) : (
                    fullRanking.map((player, index) => (
                      <ListItem
                        key={`${player.nombre_usuario}-${index}`}
                        sx={{
                          px: 3,
                          py: 2,
                          borderBottom: index < fullRanking.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          bgcolor: player.nombre_usuario === user.nombre_usuario ? 'primary.50' : 'transparent',
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
                            {player.nombre_usuario[0].toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle1" 
                              fontWeight="700"
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: { xs: '120px', sm: '200px', md: 'none' }
                              }}
                            >
                              {player.nombre_usuario}
                              {player.nombre_usuario === user.nombre_usuario && ' (Tú)'}
                            </Typography>
                          }
                          secondary={`${player.puntos} puntos`}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
