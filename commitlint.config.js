
module.exports =  {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'scope-enum': ({ scope }) => {
          return [
            !!scope && new RegExp('[A-Z]+-\\d+').test(scope),
            'scope must not be null and comply with the format：[ABC-123]'
          ]
        }
      }
    }
  ]
}
