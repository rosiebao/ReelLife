# ReelLife

A digital storytelling platform that helps users preserve their life stories, family histories, and create legacy books.

## Overview

ReelLife combines voice recording, photo uploads, AI-assisted interviews, and book generation to help people capture and share their life experiences for future generations.

## Features

### 🎤 Tell Your Story
- Multiple interview modes (Life Period, Major Event, Journey, Relationship, Wisdom)
- AI-guided interview questions
- Voice recording with real-time transcription
- Multi-media upload (photos, videos, documents, audio)

### 👥 Family Section
- Interactive family tree visualization
- Personal timeline with life events
- Family stories organized by themes
- Generate custom family history books

### 🏛️ Community Archive
- Browse and search community stories
- Filter by category (Local History, Immigration, Culture/Faith, etc.)
- Featured stories and engagement
- Share stories with the community

### 📖 Book Generation
- AI-powered chapter generation from interviews
- Select and organize chapters by theme
- 3D book preview
- Export to PDF, EPUB, and Audiobook formats

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS Grid & Flexbox
- **Vanilla JavaScript** - Interactive features
- **Mobile-First Design** - Responsive across all devices

## Project Structure

```
ReelLife/
├── src/
│   ├── index.html              # Landing page
│   ├── pages/
│   │   ├── login.html          # Login
│   │   ├── signup.html         # Sign up
│   │   ├── community.html      # Community archive
│   │   ├── family.html         # Family tree & timeline
│   │   ├── tell-story.html     # Story mode selection
│   │   ├── upload.html         # Upload memories
│   │   ├── interview.html      # AI interview
│   │   ├── chapter-preview.html # Chapter preview
│   │   ├── select-chapters.html # Chapter selection
│   │   └── book-preview.html   # Book preview & export
│   ├── css/
│   │   └── main.css            # Global styles
│   ├── js/                     # JavaScript files
│   └── images/                 # Image assets
├── Resource/                    # Original design files
├── DEVELOPMENT.md              # Development documentation
└── README.md                   # This file
```

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/rosiebao/ReelLife.git
   cd ReelLife
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   cd src
   python3 -m http.server 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Navigation

1. Start at the landing page (`index.html`)
2. Create an account or sign in
3. Explore:
   - **Community** - Browse stories from others
   - **Family** - View your family tree and timeline
   - **Tell Your Story** - Create your own stories
   - **Generate Book** - Compile your stories into a book

## Design System

### Color Palette
- **Gold**: `#C49860` (Primary actions, accents)
- **Navy Blue**: `#1E2A47` (Text, headers)
- **Light Gray**: `#F5F5F5` (Backgrounds)
- **White**: `#FFFFFF` (Cards, inputs)

### Typography
- **Headings**: Georgia, serif
- **Body**: System fonts, sans-serif

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development documentation including:
- Complete feature list
- UI/UX analysis
- Build steps and progress
- Testing instructions
- Validation checklist

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari
- Chrome Mobile

## Contributing

This is a personal project, but suggestions and feedback are welcome! Please open an issue to discuss any changes.

## Future Enhancements

- [ ] Backend API integration
- [ ] Real voice recording and transcription
- [ ] Actual file upload handling
- [ ] User authentication
- [ ] Database integration
- [ ] PDF/EPUB/Audiobook export
- [ ] Social features (comments, likes)
- [ ] Search functionality
- [ ] PWA features
- [ ] Multi-language support

## License

All rights reserved.

## Contact

Rosie Bao - [GitHub](https://github.com/rosiebao)

---

**Built with ❤️ to preserve stories and legacies**
