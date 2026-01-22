# Contributing to Solar

Thanks for your willingness to contribute. 🙌
If you contribute to this project, you agree to release your work under the license of this project.

## Development Setup

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher
- **Git**: For version control

### Getting Started

1. Fork this repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/solar.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Code Quality

### Linting

This project uses **ESLint** for code linting (migrated from tslint).

**Check for linting errors:**

```bash
npm run lint
```

**Automatically fix linting errors:**

```bash
npm run lint:fix
```

**ESLint Configuration:**

- Configuration file: `.eslintrc.js`
- Lints TypeScript and TSX files in `src`, `stories`, and `electron/src` directories
- Extends recommended rules for TypeScript, React, and React Hooks

### Code Formatting

This project uses **Prettier** for consistent code formatting.

**Format code:**

```bash
npm run prettier
```

**Automatic Formatting:**
There is a git hook set up which automatically runs `prettier` when creating a commit. This ensures code format consistency across all contributions.

**Disable Hook Temporarily:**
You can temporarily disable this hook by adding a `--no-verify` flag to your commit command:

```bash
git commit --no-verify -m "Your commit message"
```

### TypeScript

This project uses **TypeScript 5.7.x** with strict type checking enabled.

**Type Checking:**
TypeScript compilation is checked automatically during the build process. Ensure your code compiles without errors:

```bash
# Check TypeScript compilation
cd electron && tsc --noEmit
```

**TypeScript Guidelines:**

- Use explicit types where type inference is unclear
- Avoid `any` types - use `unknown` or proper types instead
- Enable strict mode in `tsconfig.json`
- Use TypeScript 5.x features appropriately

## Testing

### Test Framework

This project uses **Vitest** as the test runner with **React Testing Library** for component tests.

**Run tests:**

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Writing Tests

**Unit Tests:**

Create test files with `.test.ts` or `.test.tsx` extension:

```typescript
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import MyComponent from "./MyComponent"

describe("MyComponent", () => {
  it("renders correctly", () => {
    const { getByText } = render(<MyComponent />)
    expect(getByText("Hello")).toBeInTheDocument()
  })
})
```

**Component Tests:**

Use React Testing Library for component testing:

```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

it("handles user interaction", async () => {
  const user = userEvent.setup()
  render(<MyButton />)

  const button = screen.getByRole("button")
  await user.click(button)

  expect(screen.getByText("Clicked")).toBeInTheDocument()
})
```

### Property-Based Testing

This project uses **fast-check** for property-based testing to validate universal properties across many inputs.

**Run property-based tests:**

```bash
npm run test:pbt
```

**Writing Property Tests:**

Property tests should be tagged with the property number and description:

```typescript
import fc from "fast-check"
import { describe, it } from "vitest"

describe("Property 6: Encryption Round-Trip Integrity", () => {
  it("should maintain data integrity through encryption/decryption", () => {
    fc.assert(
      fc.property(fc.string(), fc.string({ minLength: 8 }), (data, password) => {
        const encrypted = encrypt(data, password)
        const decrypted = decrypt(encrypted, password)
        return decrypted === data
      }),
      { numRuns: 100 } // Run 100+ iterations
    )
  })
})
```

**Property Test Guidelines:**

- Each property test should run minimum 100 iterations
- Tag tests with format: `Property N: Description`
- Focus on universal properties that should hold for all valid inputs
- Use smart generators that constrain to valid input space
- Property tests are critical for security-sensitive code (encryption, signing, etc.)

### Test Coverage

Aim for high test coverage, especially for critical paths:

- **Minimum Coverage**: 80% statement coverage
- **Critical Paths**: 100% coverage for keystore and cryptographic operations
- **Security-Critical Code**: Must have both unit tests and property tests

**Generate coverage report:**

```bash
npm run test:coverage
```

## Submitting changes

To submit your changes please open a [GitHub Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) with a clear description of what you've done.

**Pull Request Checklist:**

- [ ] Code passes all linting checks (`npm run lint`)
- [ ] Code is formatted with Prettier
- [ ] All tests pass (`npm test`)
- [ ] New code has appropriate test coverage
- [ ] TypeScript compiles without errors
- [ ] Commit messages are clear and descriptive
- [ ] Documentation is updated if needed

## Development Workflow

### Running the App in Development

**Desktop (Electron):**

```bash
npm run dev

# On Mac OS:
PLATFORM=darwin npm run dev
```

**Web (Development Server):**

```bash
cd web/
npm run dev
```

### Building for Production

**Desktop:**

```bash
# Mac OS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

**Mobile (Cordova):**
See [Cordova build readme](./cordova/README.md).

### Storybook

For component development and documentation:

```bash
npm run storybook
```

## Security Considerations

### Keystore Security

**CRITICAL**: Never modify encryption parameters in the keystore implementation. This would break backward compatibility and users would lose access to their funds.

**Encryption Parameters (DO NOT CHANGE):**

- KDF: PBKDF2
- Iterations: 100,000
- Digest: SHA256
- Cipher: xsalsa20-poly1305

### Electron Security

When working with Electron code:

- Always use `contextIsolation: true`
- Always set `nodeIntegration: false`
- Use `contextBridge` for IPC communication
- Validate all IPC messages in the main process
- Never expose sensitive APIs directly to renderer

### Dependency Security

Before adding new dependencies:

```bash
# Check for vulnerabilities
npm audit

# Review the package
# - Check npm download statistics
# - Review GitHub repository
# - Check for known security issues
```

## Contributing translations

This project uses [i18next](https://www.i18next.com/) for internationalization. We made efforts to replace all hard-coded strings and set the application up for internationalization but due to limited resources we decided to make the process of adding translations a community effort. Thus all contributions of translations to this project are very welcome and appreciated.

#### Contributing translations for a new language

The following set of instructions is meant to guide you through the whole process of contributing translations for a new language: (_Note:_ Words in curly braces have to be replaced according to context/language.)

1. Fork this project and create a new branch called `feature/add-{language}-translations`
1. Checkout the new branch
1. Create a new folder for the locale you want to contribute at `{project-root}/i18n/locales/{language-code}` (choose the corresponding two-letter language code from [this](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) list of ISO 639-1 codes)
1. Copy all files from the folder [i18n/locales/en](./i18n/locales/en) to the one you just created
1. Replace the strings in the copied files with your translations
   - Do not change values contained in double curly braces (`{{...}}`), these are used by [i18next](https://www.i18next.com/translation-function/interpolation) to integrate dynamic values into the translations
   - Be precise regarding capitalization, i.e. start translated strings with uppercase/lowercase letters according to the english locale
1. Copy the file [i18n/en.ts](./i18n/en.ts) and paste it into the same directoy renaming it to `{project-root}/i18n/{language-code}.ts`
1. Open the new file and adjust the paths of the `import` statements
   (e.g. replace `import App from "./locales/en/app.json"` with `import App from "./locales/{language-code}/app.json"`)
1. Add your language code to the list of available languages in [i18n/index.ts](./i18n/index.ts)
1. Open [src/App/i18n.ts](./src/App/i18n.ts) and add a new `import translation{LANGUAGE-CODE} from "../../i18n/{language-code}"` statement as well as your new locale to the `resources` object

**Note**: The english locale should always be used for reference, i.e. you should base your translations on the contents of [i18n/locales/en](./i18n/locales/en).

Afterwards you can test if everything works fine by locally running the [development](./README.md#development) enviroment.
You can change the displayed language in the applications settings menu.

Once done you can submit a new pull request from your fork to the upstream repository.

#### Contributing changes to existing languages

If you notice wrong or missing translations for supported languages (i.e. some parts of the application are displayed in english although a different language is selected) you are welcome to contribute a change.

In case you want to fix a wrong translation you can find all translations in the [i18n/locales](./i18n/locales) directory. The easiest way to find the file you need to change might be to use GitHubs built-in search engine to search the repository for the wrong string.

In case you want to add missing translations you'd first have to find the english string that you want to translate. You can find all english translations in the [i18n/locales/en](./i18n/locales/en) directory. Afterwards you can use the `key` of that string value to add the missing translation for the other language.

**Example**: Let's assume you notice the string "Add funds" is not translated in the account settings menu.
You can then use GitHubs search engine to search the repository for `"Add funds"`.
There are two occurences, one in `i18n/locales/en/transfer-service.json` and another in `i18n/locales/en/account.json`.
Because it is displayed in the account settings menu you know that out of these two files the one you are looking for is `account.json`.
We can see that `"Add funds"` is used in `"context-menu": { ..., "deposit": {"label": "Add funds"}, ... }`.
Now you can navigate to `i18n/locales/{other-language}/account.json` and look if the `context-menu` object also contains an entry similar to `"deposit":"{"label":"Add funds"}` (which it probably does not but you should be able to find the issue from here).
