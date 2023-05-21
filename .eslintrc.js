module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "google"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/prop-types": 0,
        "arraysInObjects": false
    },
    "parserOptions": {
      "sourceType": "module",
      "allowImportExportEverywhere": true
    }
}
