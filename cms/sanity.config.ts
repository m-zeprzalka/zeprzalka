import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input' // Dodaj ten import
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'zeprzalka',

  projectId: 'bo93waal',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(), // Dodaj ten plugin
  ],

  schema: {
    types: schemaTypes,
  },
})
