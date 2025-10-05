# RealtorPMS

A comprehensive multi-tenant property management system built with Ruby on Rails and React for real estate agencies and property managers.

## Overview

RealtorPMS is a SaaS platform that enables real estate agencies to manage their property portfolios, clients, team members, and property showings. Each agency operates in an isolated environment with their own subdomain, custom branding, and team management capabilities.

## Key Features

### Multi-Tenancy
- Subdomain-based account isolation
- Each agency has independent data and branding
- Owner and team member role management
- Trial and subscription-based access control

### Property Management
- Comprehensive property listings with extensive metadata
- Support for residential, commercial, land, and other property types
- Multiple business types: sell, rent, or both
- Photo management with Active Storage
- Interactive map integration (Google Maps)
- Energy certificates and detailed specifications
- Custom fields per property type
- SEO-friendly URLs with FriendlyId
- Sample properties auto-generated on account creation

### Client Management
- Client database with search capabilities
- Property viewing history tracking
- QR code generation for contact cards (vCard)
- Client preferences and notes
- Client-property associations (CPA model)
- Property showing scheduling

### Team Collaboration
- User invitations and memberships
- Role-based permissions (owner, admin, user)
- Property assignments to team members
- Activity logs and audit trails
- Multi-account support for users

### Favorites & Organization
- Customizable favorite lists per user
- Property collections and tagging
- Quick access to saved properties

### Location System
- Dual location support:
  - Greek locations (hierarchical: root → branch → leaf areas)
  - International locations (simple area-based)
- Geocoding integration
- Map marker types (exact, circle, non-visible)

### Integrations
- **Spitogatos**: Property listing sync with popular Greek real estate portal
- **AWS S3**: Cloud storage for images and documents
- **Email notifications**: Invitations, password resets, system notifications

### Public-Facing Features
- Optional public website per agency
- Property search and filtering
- Responsive design
- Custom branding per agency

## Tech Stack

### Backend
- **Ruby on Rails 6.1**
- **PostgreSQL** database
- **Puma** web server
- **ActiveStorage** for file uploads
- **ActionCable** for real-time features

### Frontend
- **React 17** with React on Rails
- **Webpacker 5** for asset compilation
- **Bootstrap 4** for styling
- **Leaflet** for maps
- **Chart.js** for analytics
- **Flatpickr** for date/time picking
- **Parsley.js** for form validation

### Key Gems
- `bcrypt` - Authentication
- `friendly_id` - SEO-friendly URLs
- `pagy` - Pagination
- `roo` - Excel file processing
- `grover` - PDF generation
- `geocoder` - Geocoding services
- `noticed` - Notifications
- `rqrcode` - QR code generation
- `vcardigan` - vCard generation
- `whenever` - Cron job scheduling

### Development & Testing
- **RSpec** for testing
- **Capybara** for integration tests
- **Factory Bot** for test fixtures
- **Rubocop** for code linting
- **Capistrano** for deployment

## Database Models

### Core Models
- **Account**: Multi-tenant account container
- **User**: Team members with multi-account support
- **Property**: Real estate listings
- **Client**: Buyer/renter contacts
- **Location/ILocation**: Geographic data
- **Category**: Property type classification

### Association Models
- **Membership**: User-Account relationship
- **Assignment**: User-Property relationship
- **Clientship**: User-Client relationship
- **CPA**: Client-Property-Association (showing tracking)
- **Favlist**: User's property collections

### Supporting Models
- **Invitation**: Team member invitations
- **Log**: Activity tracking
- **Notification**: System notifications
- **CalendarEvent**: Scheduling
- **Extra**: Property amenities (pool, parking, etc.)
- **ModelType**: Custom field definitions
- **EntityField**: Dynamic field system

## Setup

### Prerequisites
- Ruby 2.7+
- Node.js 12+
- PostgreSQL 12+
- Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kstratis/realtorpms.git
cd realtorpms

# Install dependencies
bundle install
yarn install

# Setup database
rails db:create
rails db:migrate
rails db:seed

# Start the server
bin/webpack-dev-server
rails server
```

### Environment Variables

Configure the following in your environment:

```bash
# Database
DATABASE_URL

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_BUCKET

# Media directory
MEDIA_DIR

# Email (for notifications)
SMTP_ADDRESS
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
```

## Deployment

The application uses Capistrano for deployment:

```bash
# Deploy to staging
cap staging deploy

# Deploy to production
cap production deploy
```

## Localization

Supports multiple languages:
- English (en)
- Greek (el)

Translations managed through Rails i18n with locale files in `config/locales/`.

## Account Types

### Flavors
- **Greek**: For Greek market with local location hierarchy
- **International**: For international markets with simple locations

### Subscription Status
- **Trial**: 14-day trial period
- **Active**: Paid subscription
- **Cancelled**: Subscription cancelled
- **Expired**: Past due

## Testing

```bash
# Run all tests
rspec

# Run specific test file
rspec spec/models/property_spec.rb

# Run with coverage
COVERAGE=true rspec
```

## Project Structure

```
app/
├── controllers/     # Rails controllers
├── models/          # ActiveRecord models
├── views/           # ERB templates
├── javascript/      # React components and frontend code
│   ├── bundles/     # React entry points
│   ├── controllers/ # Stimulus controllers
│   └── stylesheets/ # SCSS styles
├── mailers/         # Email templates
├── helpers/         # View helpers
└── services/        # Business logic services

config/
├── locales/         # i18n translations
├── initializers/    # Rails initializers
└── environments/    # Environment configs

db/
├── migrate/         # Database migrations
└── seeds.rb         # Seed data

spec/                # RSpec tests
```

## Contributing

This is an open-source project. Contributions welcome via pull requests.

## License

MIT Licence

## Contact

For questions or support, please open an issue on GitHub.
