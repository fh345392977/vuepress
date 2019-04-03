jest.mock('vuepress-plugin-mocked-a')
jest.mock('vuepress-plugin-mocked-b')
jest.mock('@org/vuepress-plugin-mocked-a')

import PluginAPI from '../../plugin-api/index'
import { PLUGIN_OPTION_MAP } from '../../plugin-api/constants'

describe('Plugin', () => {
  test('registerOption', () => {
    const api = new PluginAPI()
    const readyHandler = () => {}
    api.registerOption(PLUGIN_OPTION_MAP.READY.key, readyHandler)
    expect(api.options.ready.values).toHaveLength(1)
    expect(api.options.ready.values[0]).toBe(readyHandler)
  })

  test('useByPluginsConfig', () => {
    [
      ['mocked-a'],
      [['mocked-a']],
      [['mocked-a', true]],
      { 'mocked-a': true }
    ].forEach(pluginsConfig => {
      const api = new PluginAPI()
      api.useByPluginsConfig(pluginsConfig)
      expect(api.enabledPlugins).toHaveLength(1)
      expect(api.enabledPlugins[0].name).toBe('vuepress-plugin-mocked-a')
      expect(api.disabledPlugins).toHaveLength(0)
    })
  })

  test('useByPluginsConfig - disable plugin', () => {
    [
      [['mocked-a', false]],
      { 'mocked-a': false }
    ].forEach(pluginsConfig => {
      const api = new PluginAPI()
      api.useByPluginsConfig(pluginsConfig)
      expect(api.enabledPlugins).toHaveLength(0)
      expect(api.disabledPlugins).toHaveLength(1)
      expect(api.disabledPlugins[0].name).toBe('vuepress-plugin-mocked-a')
    })
  })

  test('useByPluginsConfig - get options', () => {
    const pluginOptions = {};
    [
      [['mocked-a', pluginOptions]],
      { 'mocked-a': pluginOptions }
    ].forEach(pluginsConfig => {
      const api = new PluginAPI()
      api.useByPluginsConfig(pluginsConfig)
      expect(api.enabledPlugins[0].$$options).toBe(pluginOptions)
    })
  })

  test('ensure the namesake plugin is only executed once.', () => {
    const pluginOptions1 = {}
    const pluginOptions2 = {}
    const pluginOptions3 = {}
    const pluginsConfig = [
      ['mocked-a', pluginOptions1],
      ['mocked-a', pluginOptions2],
      ['mocked-a', pluginOptions3]
    ]
    const api = new PluginAPI()
    api.useByPluginsConfig(pluginsConfig)
    expect(api.enabledPlugins).toHaveLength(1)
    // using the last one
    expect(api.enabledPlugins[0].$$options).toBe(pluginOptions3)
  })

  test('ensure a "multuple" plugin can be applied multuple times.', () => {
    const pluginOptions1 = { a: 1 }
    const pluginOptions2 = { b: 1 }
    const pluginsConfig = [
      ['mocked-b', pluginOptions1],
      ['mocked-b', pluginOptions2]
    ]
    const api = new PluginAPI()
    api.useByPluginsConfig(pluginsConfig)
    expect(api.enabledPlugins).toHaveLength(2)
    // using the last one
    expect(api.enabledPlugins[0].$$options).toBe(pluginOptions1)
    expect(api.enabledPlugins[1].$$options).toBe(pluginOptions2)
  })
})
