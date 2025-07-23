# FilmTarsnak - Movie Streaming Platform

A modern movie streaming platform built with Nuxt 3, featuring Persian language support and YekanBakh font.

## 🚀 Features

- **Movie Streaming**: Watch movies and TV series with HLS support
- **Persian Language**: Full RTL support with Persian numbers
- **Rating System**: User rating and review system with star ratings
- **Interactive Rating**: Real-time rating submission with success feedback
- **Responsive Design**
- **Modern UI**: Beautiful and intuitive user interface



##  Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Font**: YekanBakh (Persian font with Persian numbers)
- **Video Player**: HLS.js
- **Icons**: Custom SVG icons

##  Prerequisites

- **Node.js**: 20.19.4 or higher
- **npm/yarn/pnpm**: Package manager

##  Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd filmtarsnak-test
```

### 2. Install dependencies

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```bash
# API Configuration
NUXT_PUBLIC_API_BASE_URL=https://ylnk.site/test/

# Environment
NODE_ENV=development
```

### 4. Font Setup

Make sure the YekanBakh font file is placed in `assets/fonts/`:
- `YekanBakhFaNum-VF.ttf`

### 5. Start development server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
filmtarsnak-test/
├── assets/
│   ├── css/
│   │   └── main.css          # Global styles with YekanBakh font
│   ├── fonts/
│   │   ├── fonts.css         # Font face definitions
│   │   └── YekanBakhFaNum-VF.ttf
│   └── img/
├── components/
│   ├── Icons/                # Custom SVG icons
│   ├── MovieInfoSection.vue  # Movie information display
│   ├── VideoPlayer.vue       # HLS video player
│   ├── RatingSection.vue     # User rating system with star ratings
│   ├── StarRating.vue        # Star rating display component
│   ├── StarRatingInput.vue   # Interactive star rating input
│   ├── EpisodesList.vue      # Episodes list with rating integration
│   └── ...
├── composables/
│   ├── useApi.ts            # Centralized API management
│   ├── useMovie.ts          # Movie data management
│   └── ...
├── pages/
│   ├── index.vue            # Home page (redirects to player)
│   └── player/
│       └── [id].vue         # Movie player page
├── stores/
│   └── useMovieStore.ts     # Pinia store for movie state
└── ...
```

## 🔧 API Configuration

### Environment Variables

The application uses environment variables for API configuration:

```bash
# API Configuration
NUXT_PUBLIC_API_BASE_URL=https://ylnk.site/test/

# Environment
NODE_ENV=development
```

### Using the API

#### 1. Using useApi composable

```typescript
const { get, post, baseUrl } = useApi();

// GET request
const data = await get('?action=info&id=123');

// POST request
const result = await post('?action=create', { title: 'Test' });
```

#### 2. Direct usage of runtimeConfig

```typescript
const config = useRuntimeConfig();
const apiUrl = config.public.apiBaseUrl;
```

### API Endpoints

- `GET ?action=info&id={id}` - Get movie information
- `GET ?action=stream&id={id}` - Get video stream URL
- `POST ?action=rate&id={id}` - Submit user rating and comments
- `GET ?action=stream&id={id}&episode={episode}` - Get specific episode stream

## 🎨 Styling & Fonts

### YekanBakh Font

The project uses YekanBakh font with Persian number support:

```css
/* Font family is automatically applied to all elements */
font-family: 'YekanBakh', system-ui, sans-serif;
```

### RTL Support

The application is fully RTL-compatible:

```css
direction: rtl;
text-align: right;
```

### Tailwind Classes

Custom Tailwind classes available:
- `font-yekan` - YekanBakh font family
- `rtl` - RTL direction
- `ltr` - LTR direction

## 📱 Responsive Design

The application is mobile-first and responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Production Deployment

### Build for production

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### Preview production build

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

### Environment Variables for Production

```bash
NUXT_PUBLIC_API_BASE_URL=https://your-production-api.com/
NODE_ENV=production
```

## 🔒 Security Notes

- `NUXT_PUBLIC_*` variables are accessible on the client-side
- Use private variables for sensitive information
- Always use HTTPS in production
- API keys should be stored securely

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type checking
npm run typecheck

# Lint
npm run lint
```

### Code Style

- TypeScript for type safety
- Vue 3 Composition API
- Tailwind CSS for styling
- ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API setup guide

---

**Note**: Make sure to have Node.js version 20.19.4 or higher installed for optimal performance and compatibility.
