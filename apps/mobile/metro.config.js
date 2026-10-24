const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
const webStorage = path.resolve(__dirname, 'src/lib/webStorage.ts')

config.resolver.resolveRequest = (context, moduleName, platform) =>
  platform === 'web' && moduleName === 'expo-sqlite/kv-store'
    ? { type: 'sourceFile', filePath: webStorage }
    : context.resolveRequest(context, moduleName, platform)

module.exports = config
