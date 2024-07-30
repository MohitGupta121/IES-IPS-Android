module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env:{
    production : {
      plugins:['react-native-paper/babel',
    ]
    }
  },
  plugins : [
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
};