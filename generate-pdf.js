const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const text = `ProductApp Analysis

1. PROJECT OVERVIEW

- What is this application about?
This is a ProductApp, a React Native mobile application built with Expo that allows users to manage a simple product catalog. Users can add products with names, prices, and images; view products in a searchable list; edit existing products; and delete products.

- What problem does it solve?
It provides a local product management experience for mobile users who need a small inventory catalog system without external backend dependencies.

- Overall architecture pattern used?
The app uses a feature-based architecture centered on products, with separation between UI components, Redux state management, type definitions, and app navigation.

2. FOLDER STRUCTURE EXPLANATION

- Root Level Files:
  - app.json: Expo project config including app name, icon, splash, and plugins.
  - babel.config.js: Babel config using expo preset and nativewind.
  - eslint.config.js: ESLint config for Expo.
  - global.css: Tailwind directives and custom utility classes.
  - metro.config.js: Metro bundler config for NativeWind.
  - package.json: Dependencies and npm scripts.
  - tailwind.config.js: Tailwind theme extension and NativeWind preset.
  - tsconfig.json: TypeScript config with strict mode and path alias.

- app/ Directory:
  - _layout.tsx: Root layout providing Redux store, SafeAreaProvider, GestureHandlerRootView, and Stack navigation.
  - (drawer)/_layout.tsx: Drawer layout and screen options.
  - (drawer)/index.tsx: Home screen with search input and product list.
  - (drawer)/uploadProducts.tsx: Product upload/edit screen with form and image picker.

- assets/images: Static image assets used by Expo.
- component/productCard.tsx: Reusable card component for product display.
- store/: Redux store and hooks.
- type/productType.tsx: Product type definitions.

3. WORK APPROACH & PATTERNS

- Design patterns used:
  - Container/presentational separation (pages contain logic, component handles UI)
  - Redux Toolkit slice pattern for state management
  - Custom typed hooks for Redux
  - Feature-based modular organization

- State management:
  - Redux Toolkit with one slice: productSlice.
  - Actions: addProduct, updateProductById, removeProduct, getProductById.
  - Selector: getProducts(search).

- Data fetching and handling:
  - No external backend. Data is local in Redux state.
  - Search filtering is done in the selector getProducts.

- Forms and validation:
  - Controlled state in uploadProducts.tsx.
  - Basic required-field validation and error state.
  - Image selection through expo-image-picker.

- Routing:
  - Expo Router file-based routing.
  - Drawer navigation in app/(drawer)/_layout.tsx.
  - Dynamic editing route parameter: ?id=.

- Authentication/authorization:
  - None implemented.

- Reusable components:
  - productCard.tsx is the main reusable UI component.
  - It accepts data props and handles edit/delete callbacks.

4. LIBRARIES & DEPENDENCIES

- @expo/vector-icons ^15.0.3: icon rendering in product cards and UI.
- @react-navigation/drawer ^7.9.9: drawer navigation integration through Expo Router.
- @react-navigation/native ^7.1.8: navigation foundation.
- @reduxjs/toolkit ^2.11.2: Redux state management.
- babel-preset-expo ^55.0.19: Expo Babel preset.
- expo ^~54.0.33: Expo framework.
- expo-image-picker ^17.0.11: image picker for camera/gallery.
- expo-router ^~6.0.23: file-based routing.
- nativewind ^4.2.3 and tailwindcss ^3.4.19: styling utilities in React Native.
- react ^19.1.0 and react-native ^0.81.5: React and React Native core.
- react-redux ^9.2.0: Redux binding for React.

5. NAMING CONVENTIONS

- Files: PascalCase for components, underscore prefix for layout files, camelCase for directories.
- Variables/functions: camelCase.
- Types/interfaces: PascalCase.
- Components: PascalCase.
- Style: consistent use of React functional components, TypeScript typing, and path alias imports.

6. DATA FLOW

- Data flows from Redux store to UI through selectors and useAppSelector.
- No API calls exist.
- User interactions dispatch Redux actions that update state immediately.
- Errors are handled with Alert and try/catch in action dispatch wrappers.

7. ANYTHING NOTABLE

- Local-only product storage with no persistence.
- Maximum product limit enforcement in addProduct.
- Edit form preloads existing product data from getProductById.
- Drawer header shows product count dynamically.
- Image picker supports both camera and gallery.
`;

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 10;
  const pageWidth = page.getWidth();
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  const lines = wrapText(text, timesRomanFont, fontSize, maxWidth);
  let y = page.getHeight() - margin;

  for (const line of lines) {
    if (y < margin + fontSize) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = page.getHeight() - margin;
    }
    page.drawText(line, {
      x: margin,
      y: y,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    y -= fontSize + 4;
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('ProductApp_analysis.pdf', pdfBytes);
  console.log('PDF written to ProductApp_analysis.pdf');
}

function wrapText(text, font, fontSize, maxWidth) {
  const paragraphs = text.split('\n');
  const lines = [];

  for (const paragraph of paragraphs) {
    if (paragraph === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line.length === 0 ? word : `${line} ${word}`;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && line.length > 0) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      lines.push(line);
    }
  }
  return lines;
}

createPdf().catch((err) => {
  console.error(err);
  process.exit(1);
});
