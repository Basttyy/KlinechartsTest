# KlinechartsTest

## Project Description
KlinechartsTest is a web-based financial charting application built using Vue.js and the Klinecharts library. It provides interactive candlestick charts for visualizing financial data, along with tools for drawing overlays, replaying historical data, and analyzing trends. The project is designed to mimic features similar to TradingView, including drawing tools, replay functionality, and customizable timeframes.

## Features
- Interactive candlestick charts.
- Drawing tools for vertical lines, horizontal lines, and trendlines.
- Historical data replay functionality with adjustable speed and intervals.
- Customizable timeframes for chart data.
- Responsive design for various screen sizes.

## Setup Instructions

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Basttyy/KlinechartsTest.git
   ```

2. Navigate to the project directory:
   ```bash
   cd KlinechartsTest
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production
1. Build the project:
   ```bash
   npm run build
   ```

2. Serve the production build:
   ```bash
   npx vite preview
   ```

3. Open your browser and navigate to the preview URL (default: `http://localhost:4173`).

### Testing
To run tests (if applicable):
```bash
npm run test
```

## Folder Structure
- `src/`: Contains the source code for the application.
  - `components/`: Vue components for the UI.
  - `constants.ts`: Shared constants used across the application.
  - `dataprocessor.ts`: Logic for processing and fetching chart data.
  - `helpers.ts`: Utility functions for various tasks.
  - `main.ts`: Application entrypoint.
  - `types.ts`: Type utilities and declarations for the applicaton
- `public/`: Static assets.
- `dist/`: Production build output.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Vue.js](https://vuejs.org/)
- [Klinecharts](https://github.com/liihuu/klinecharts)
- [Tailwind CSS](https://tailwindcss.com/)
