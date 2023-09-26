# Polkadot - Asset Conversion Pallet

This project is intended to be used as a starting point for building a decentralized exchange on Polkadot using the Asset Conversion Pallet.

You can find additional documentation on the Asset Conversion File [here](./ASSET_CONVERSION_PALLET.md).

### Install dependencies:

`pnpm install`

### Run Project

`pnpm run dev`

## UI Kit

Instructions to edit colors, fonts, images, or text translation of the project:

We are using Tailwind.css, all of the config for the colors and fonts can be found in [tailwind.config.js](./tailwind.config.js).

For translation and dynamic text change we use `i18n`.
The config can be found in [./src/app/config/i18n/index.ts](./src/app/config/i18n/index.ts) and the translations in [./src/app/translations/en.json](./src/app/translations/en.json).
