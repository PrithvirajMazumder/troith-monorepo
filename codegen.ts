import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:7800/graphql',
  documents: ['apps/troithWeb/**/*.{ts,tsx}'],
  generates: {
    './apps/troithWeb/__generated__/': {
      preset: 'client-preset',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql'
      }
    }
  }
}

export default config
