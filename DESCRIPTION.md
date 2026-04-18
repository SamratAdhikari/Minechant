# Minechant

A Minecraft enchantment optimizer that helps players calculate the most efficient way to combine enchanted books and items using the game's anvil mechanics.

## Overview

Minechant is a web application that simulates Minecraft's anvil enchanting system. It helps players plan optimal enchantment combinations by calculating XP costs, enforcing game rules (level caps, incompatibility), and suggesting the best merging strategies.

Whether you're trying to maximize your gear's power or minimize XP expenditure, Minechant provides the tools to plan your enchantment strategy before stepping foot in the game.

## Features

### 1. Item Selection

The application provides a comprehensive selection of Minecraft items organized into categories:

**Weapons:**
- Sword
- Axe
- Mace
- Spear
- Trident

**Tools:**
- Pickaxe
- Shovel
- Hoe

**Armor:**
- Helmet
- Chestplate
- Leggings
- Boots
- Turtle Shell

**Special Items:**
- Bow
- Crossbow
- Elytra
- Fishing Rod
- Brush
- Flint & Steel
- Shears
- Shield

Each item is displayed with its corresponding Minecraft sprite image sourced from Cloudinary.

### 2. Enchantment System

The enchantment system supports all standard Minecraft enchantments with full metadata:

**Enchantment Properties:**
- **Level Ranges (I-V)**: Each enchantment has a maximum level (e.g., Efficiency V, Protection IV)
- **Weight Values**: Affects the cost calculation - higher weight means higher XP cost
- **Incompatibility Rules**: Prevents mutually exclusive enchantments from being combined
- **Item Eligibility**: Validates which enchantments can be applied to which items

**Supported Enchantments Include:**
- Protection, Fire Protection, Blast Protection, Projectile Protection
- Sharpness, Smite, Bane of Arthropods, Density, Breach
- Efficiency, Unbreaking, Fortune, Silk Touch
- Power, Punch, Flame, Infinity
- Looting, Sweeping Edge, Knockback, Fire Aspect
- Mending, Unbreaking, Thorns
- And many more...

### 3. Calculator Engine

The core calculation engine implements accurate Minecraft anvil mechanics:

**XP Level Cost Calculation:**
- Uses the official Minecraft XP formula:
  - Levels 1-16: `levels² + 6 * levels`
  - Levels 17-31: `2.5 * levels² - 40.5 * levels + 360`
  - Levels 32+: `4.5 * levels² - 162.5 * levels + 2220`

**Work Penalty System:**
- Each time an item is combined in an anvil, it accumulates a "work count"
- Work penalty formula: `2^workCount - 1`
- This penalty stacks with each combination, making early planning crucial

**39-Level Cap Enforcement:**
- The total cost (enchant cost + penalty) cannot exceed 39 levels
- The calculator detects and warns when combinations would exceed this cap

**Bidirectional Incompatibility Checking:**
- Validates both directions of incompatibility rules
- Ensures no invalid enchantment combinations are allowed

**Item-Specific Validation:**
- Verifies that enchantments are eligible for the target item
- Prevents invalid transfers (e.g., trying to put Fortune on a sword)

### 4. Recursive Solver with Memoization

The calculator uses an intelligent solving algorithm:

- **Recursive Search**: Explores all possible merge combinations
- **Memoization**: Caches results to avoid redundant calculations
- **Optimal Path Finding**: Finds the combination with minimum total XP
- **Warning System**: Reports when combinations exceed the 39-level cap

### 5. User Interface

**Visual Design:**
- Minecraft-inspired color scheme (green/teal theme)
- Responsive design for mobile, tablet, and desktop
- Interactive hover states and selection indicators
- Splash screen animation for visual appeal

**Components:**
- **Title**: Application branding
- **Item Container**: Grid display of selectable items
- **Enchantment Container**: Dynamic list of available enchantments based on selected item
- **Calculate Button**: Triggers the optimization calculation
- **Splash Screen**: Displays results

### 6. State Management

Built with Redux Toolkit for robust state handling:

- **Selection Slice**: Manages selected item and enchantments
- **Enchantment Slice**: Handles enchantment data and calculations
- **Store Configuration**: Centralized state management

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **State Management**: Redux Toolkit
- **Styling**: MUI (Material-UI) + Tailwind CSS
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

## How to Use

1. **Select an Item**: Click on any Minecraft item you want to enchant
2. **Choose Enchantments**: Select the enchanted books you want to combine
3. **Calculate**: Click the calculate button to get optimal merging instructions
4. **Review Results**: See the step-by-step anvil combinations and total XP cost

## Project Structure

```
├── app/
│   ├── _components/
│   │   ├── CalculateButton/     # Calculate action button
│   │   ├── Enchant/             # Individual enchantment display
│   │   ├── EnchantmentContainer/ # Enchantment selection grid
│   │   ├── Item/                # Individual item display
│   │   ├── ItemContainer/       # Item selection grid
│   │   ├── SplashScreen/        # Results display
│   │   └── Title/               # Application title
│   ├── api/
│   │   └── generate-enchantment/
│   │     └── enchantment-calculate.js  # Core calculation engine
│   ├── assets/
│   │   ├── enchants.json        # Enchantment data
│   │   └── items.json           # Item data with image URLs
│   ├── redux/
│   │   ├── store.js             # Redux store configuration
│   │   └── slices/
│   │       ├── enchantmentSlice.js   # Enchantment state
│   │       └── selectionSlice.js     # Selection state
│   ├── globals.css              # Global styles
│   ├── layout.js                # App layout
│   └── page.js                  # Main application page
├── public/
│   └── fonts/                   # Custom fonts
├── package.json                 # Dependencies
├── next.config.mjs              # Next.js configuration
├── tailwind.config.mjs          # Tailwind configuration
└── eslint.config.mjs            # ESLint configuration
```

## Data Files

### items.json
Contains all supported Minecraft items with:
- Unique ID
- Display name
- Cloudinary image URL

### enchants.json
Contains all enchantments with:
- Name
- Maximum level
- Weight (cost multiplier)
- Incompatible enchantments list
- Eligible items list

## License

MIT