const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Configuración específica para resolver el problema de importLocationsPlugin
config.resolver.platforms = ["ios", "android", "native", "web"]

// Asegurar que Metro use la versión correcta
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
}

module.exports = config
