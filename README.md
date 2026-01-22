<h1 align="center">Solar Wallet</h1>

<p align="center">
  <a href="https://github.com/satoshipay/solar/releases/latest">
    <img alt="Latest stable release" src="https://badgen.net/github/release/satoshipay/solar/stable" />
  </a>
  <a href="https://github.com/satoshipay/solar/releases/latest">
    <img alt="MacOS" src="https://badgen.net/badge/icon/MacOS?icon=apple&label&color=cyan" />
  </a>
  <a href="https://github.com/satoshipay/solar/releases/latest">
    <img alt="Windows" src="https://badgen.net/badge/icon/Windows?icon=windows&label&color=cyan" />
  </a>
  <a href="https://github.com/satoshipay/solar/releases/latest">
    <img alt="Android" src="https://badgen.net/badge/icon/Android?icon=googleplay&label&color=cyan" />
  </a>
  <a href="https://github.com/satoshipay/solar/releases/latest">
    <img alt="iOS" src="https://badgen.net/badge/icon/iOS?icon=apple&label&color=cyan" />
  </a>
</p>

<br />

User-friendly Stellar wallet, featuring multi-signature, custom assets management and more.

Runs on Mac OS, Windows, Linux, Android and iOS.

## Download

See <https://github.com/satoshipay/solar/releases>. You will find the binaries there.

## Key security

Keys are encrypted with a key derived from the user's password before storing them on the local filesystem. That means that the user's secret key is safe as long as their password is strong enough. However, if they forget their password there will be no way of recovering the secret key. That's why you should always make a backup of your secret key.

The encryption key is derived from the password using `PBKDF2` with `SHA256` (100,000 iterations). The actual encryption is performed using `xsalsa20-poly1305`.

**Important**: The encryption parameters are unchanged from previous versions to maintain backward compatibility with existing keystores.

## Development

### Prerequisites

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **TypeScript**: Version 5.7.x (installed as dev dependency)
- **React**: Version 18.3.x
- **Electron**: Version 40.x (for desktop builds)

### Desktop

Install the dependencies first:

```
npm install
```

To run the app in development mode:

```
npm run dev

# On Mac OS:
PLATFORM=darwin npm run dev
```

To run the tests:

```
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run property-based tests only
npm run test:pbt
```

To run the linter:

```
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

To run the storybook:

```
npm run storybook
```

### Run dev server without electron

```
cd web/
npm run dev
```

### Android/iOS

See [Cordova build readme](./cordova/README.md).

### Production build

#### Desktop

Build commands for each platform:

```
# Build for Mac OS (requires Mac OS)
npm run build:mac

# Build signed Mac OS app (requires code signing certificate)
npm run build:mac:signed

# Build for Windows
npm run build:win

# Build signed Windows app (requires code signing certificate)
npm run build:win:signed

# Build for Linux
npm run build:linux
```

**Note**: The build process uses Parcel v1.12.4 for bundling and electron-builder v26.5.0 for packaging.

#### Building windows binaries on macOS

Starting with macOS Catalina 32-bit executables are not supported. This means that the windows binaries cannot be build natively. One can circumvent this issue by using docker for building the windows binaries. Details are documented [here](https://www.electron.build/multi-platform-build#build-electron-app-using-docker-on-a-local-machine). Since Solar is using Squirrel.Windows the `electronuserland/builder:wine-mono` image should be used.

To run the docker container use:

```
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 -v /Volumes/Certificates/solar:/root/Certs \
 electronuserland/builder:wine-mono bash -c 'npm config set script-shell bash && npm install && npm run build:win:signed'
```

**Note:** We have seen weird module resolution troubles with Parcel. In this case make sure to `rm -rf node_modules/` **on the host**, then try again.

### Available npm scripts

- `npm run dev` - Run the app in development mode with hot reload
- `npm run dev:bundle` - Run Parcel bundler in watch mode
- `npm run dev:app` - Run Electron app in development mode
- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:pbt` - Run property-based tests only
- `npm run lint` - Check for linting errors using ESLint
- `npm run lint:fix` - Fix linting errors automatically
- `npm run prettier` - Format code with Prettier
- `npm run storybook` - Run Storybook for component development
- `npm run build:mac` - Build Mac OS desktop app
- `npm run build:win` - Build Windows desktop app
- `npm run build:linux` - Build Linux desktop app
- `npm run build:mac:signed` - Build signed Mac OS app (requires certificate)
- `npm run build:win:signed` - Build signed Windows app (requires certificate)

### Signed binaries

To sign the binaries, make sure you have the code signing certificates on your local filesystem as a `.p12` file and have the password for them. Make sure not to save the certificates in the Solar directory in order to not accidentally bundling them into the app installer!

You can create a `signing-mac.env` and a `signing-win.env` file, pointing `electron-builder` to the right certificate to use for each target platform:

```
CSC_LINK=~/secret-certificates/SatoshiPayLtd.p12   # point to your local certificate file
```

Now run `npm run build:*:signed` to create a signed application build. You will be prompted for the certificate's password.

To check the Mac DMG signature, run `codesign -dv --verbose=4 ./electron/dist/<file>`. To verify the Windows installer signature, you can upload the file to `virustotal.com`.

Newer versions of Mac OS require apps to be notarized. The `build:mac:signed` script will notarize the app. For this to succeed, you also need to add your Apple ID to your `signing-mac.env` file:

```
APPLE_ID=me@crypto.rocks
```

Note: Application signing has only been tested on a Mac OS development machine so far.

#### Android/iOS

See [Cordova build readme](./cordova/README.md).

## License

MIT
