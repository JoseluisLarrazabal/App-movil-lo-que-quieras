# Lo Que Quieras - Marketplace de Servicios

Una aplicación móvil completa para conectar usuarios con proveedores de servicios locales.

## 🚀 Características

- **Autenticación completa** - Login, registro y gestión de usuarios
- **Múltiples roles** - Usuario, Proveedor y Administrador
- **Búsqueda avanzada** - Filtros por categoría, ubicación y precio
- **Sistema de reservas** - Gestión completa de citas y servicios
- **Perfiles de usuario** - Información detallada y calificaciones
- **Interfaz moderna** - Diseño Material Design con React Native Paper

## 📱 Tecnologías

- **React Native** 0.72.6
- **Expo** 49.0.15
- **TypeScript** para tipado estático
- **Redux Toolkit** para gestión de estado
- **React Navigation** para navegación
- **React Native Paper** para componentes UI
- **Expo Linear Gradient** para gradientes
- **React Native Chart Kit** para gráficos

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
\`\`\`bash
git clone [url-del-proyecto]
cd lo-que-quieras
\`\`\`

2. **Instala las dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Inicia la aplicación**
\`\`\`bash
npx expo start
\`\`\`

## 📋 Credenciales de prueba

- **Usuario**: user@test.com
- **Proveedor**: provider@test.com  
- **Administrador**: admin@test.com
- **Contraseña**: cualquiera

## 🏗️ Estructura del proyecto

\`\`\`
src/
├── components/          # Componentes reutilizables
├── context/            # Context API (AuthContext)
├── navigation/         # Configuración de navegación
├── redux/             # Store y slices de Redux
├── screens/           # Pantallas de la aplicación
│   ├── auth/         # Pantallas de autenticación
│   ├── user/         # Pantallas de usuario
│   ├── provider/     # Pantallas de proveedor
│   └── admin/        # Pantallas de administrador
└── theme.ts          # Configuración de tema
\`\`\`

## 🎯 Funcionalidades principales

### Para Usuarios
- Buscar y filtrar servicios
- Ver perfiles de proveedores
- Realizar reservas
- Sistema de calificaciones
- Historial de servicios

### Para Proveedores
- Gestionar servicios ofrecidos
- Ver solicitudes de clientes
- Dashboard con estadísticas
- Gestión de horarios

### Para Administradores
- Panel de control completo
- Gestión de usuarios
- Gestión de categorías
- Reportes y análisis

## 🔧 Configuración adicional

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
\`\`\`
API_URL=https://tu-api.com
GOOGLE_MAPS_API_KEY=tu-clave-de-google-maps
\`\`\`

### Configuración de mapas (opcional)
Para habilitar la funcionalidad de mapas, agrega tu API key de Google Maps en `app.json`.

## 📦 Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web
- `npm run clean` - Limpia caché y reinicia

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Expo](https://docs.expo.dev/)
2. Consulta los [issues](https://github.com/tu-usuario/lo-que-quieras/issues) existentes
3. Crea un nuevo issue si no encuentras solución

## 🔄 Próximas funcionalidades

- [ ] Notificaciones push
- [ ] Integración con mapas
- [ ] Pagos en línea
- [ ] Chat en tiempo real
- [ ] Sistema de reseñas mejorado
- [ ] Modo offline
