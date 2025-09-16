# ArcLight Security Academy

A comprehensive Security+ learning game built with Next.js, featuring adaptive learning, spaced repetition, and immersive spy-themed missions.

## Features

- **Adaptive Placement Testing** - 15-question assessment with confidence sliders to identify strengths and weaknesses
- **Spaced Repetition Learning** - Smart scheduling system that adapts based on performance and confidence
- **Interactive Missions** - Two mission types:
  - **Log Hunt**: Analyze authentication logs and write incident reports
  - **Zone Builder**: Drag-and-drop network architecture design
- **Alternative Explanations** - 6 different explanation modes (analogy, visual, step-by-step, story, summary, technical)
- **Progress Tracking** - Comprehensive heatmaps and mastery tracking across all Security+ domains
- **Accessibility Features** - Dyslexia-friendly fonts and motion reduction options
- **Ethics Gate** - Responsible learning consent system

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository or extract the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── placement/         # Adaptive placement quiz
│   ├── academy/           # Learning objectives dashboard
│   ├── missions/          # Mission selection
│   ├── mission/[id]/      # Individual mission pages
│   ├── review/            # Daily drill/review page
│   └── legal/ethics-gate/ # Ethics consent page
├── components/            # Reusable React components
├── data/                  # Static JSON data files
├── lib/                   # Utility functions and logic
├── store/                 # Zustand state management
└── README.md
```

## Data Files

All content is stored in JSON files under `/data/`:

### Adding Questions

Edit `data/questions.json` to add new questions:

```json
{
  "id": "Q16",
  "objectiveId": "GEN-101",
  "domain": "General Security Concepts",
  "stem": "Your question text here...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answerIndex": 0,
  "rationale": "Standard explanation...",
  "altExplanations": [
    {"mode": "analogy", "text": "Like a..."},
    {"mode": "picture", "text": "Imagine..."},
    {"mode": "steps", "text": "1) First... 2) Then..."},
    {"mode": "story", "text": "An analyst..."},
    {"mode": "table", "text": "Summary format..."},
    {"mode": "cli", "text": "Command or N/A"}
  ],
  "difficulty": 1
}
```

### Adding Objectives

Edit `data/objectives.json` to add learning objectives:

```json
{
  "id": "NEW-123",
  "domain": "Your Domain",
  "title": "Objective description",
  "weight": 3,
  "status": "unseen",
  "nextDue": "",
  "mastery": 0
}
```

### Adding Missions

Edit `data/missions.json` to add new missions. Currently supports:
- `log-hunt`: Text analysis and incident reporting
- `zone-builder`: Drag-and-drop network design

## Key Components

- **QuizEngine**: Handles question display, confidence sliders, and answer submission
- **ExplanationSwitcher**: Cycles through different explanation modes
- **HeatmapProgress**: Visual domain mastery display
- **MissionCard**: Mission selection interface
- **StatsBar**: Rank, intel, and progress display

## State Management

The app uses Zustand with localStorage persistence. All progress is saved locally:

- Question results and confidence levels
- Mission completions and scores
- Learning objective mastery and scheduling
- User preferences (dyslexia mode, motion reduction)

## Safety & Ethics

- All scenarios use simulated data only
- Ethics gate requires consent before accessing missions
- No real-world offensive techniques or actual vulnerabilities
- Focus on defensive security practices

## Spaced Repetition Algorithm

- **Miss**: Review in 24 hours
- **First correct**: Review in 3 days
- **Second consecutive correct**: Review in 7 days, mark as mastered if 80%+ mastery
- **High-confidence errors**: Require two clean wins before mastering

## Building for Production

```bash
npm run build
```

The app is configured for static export and can be deployed to any static hosting service.

## Next Steps

Future enhancements could include:

- Integration with Professor Messer video links
- Practice test mode with timing
- Progress export/import functionality
- Additional mission types
- Community features and leaderboards
- Integration with actual CompTIA practice tests

## License

This project is for educational purposes only. All Security+ objectives and concepts remain property of CompTIA.

## Support

This is a learning tool designed to supplement official Security+ study materials. For official certification information, visit CompTIA's website.