# Overview

This is a simple static landing page designed to promote a Telegram group focused on dating and social connections. The project consists of a single HTML page with embedded CSS and analytics tracking, deployed on Vercel with a custom routing configuration. The landing page is optimized for social media sharing with Open Graph and Twitter Card meta tags.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single Page Application**: Built as a static HTML page with embedded CSS styling
- **Responsive Design**: Uses CSS media queries and viewport meta tags for mobile compatibility
- **Animation Framework**: Custom CSS keyframe animations for enhanced user experience
- **SEO Optimization**: Comprehensive meta tag implementation including Open Graph and Twitter Cards for social sharing

## Deployment Strategy
- **Static Hosting**: Designed for deployment on Vercel as a static site
- **Custom Routing**: Uses Vercel's rewrites configuration to handle all routes through the main Index.html file
- **CDN Integration**: Leverages external CDN resources for icons and assets

## Analytics Integration
- **Google Analytics 4**: Integrated with gtag.js for user behavior tracking and conversion monitoring
- **Performance Tracking**: Configured to track page views and user interactions

# External Dependencies

## Analytics Services
- **Google Analytics**: GA4 property (G-H0H97SH5HQ) for web analytics and user tracking
- **Google Tag Manager**: Uses gtag.js library for event tracking and conversion measurement

## CDN Services
- **Flaticon CDN**: External icon hosting for favicon and social media images
- **Google Analytics CDN**: External script loading for analytics functionality

## Hosting Platform
- **Vercel**: Static site hosting with custom routing configuration through vercel.json
- **Domain Configuration**: Supports custom domain setup with proper meta tag references

## Social Media Integration
- **Open Graph Protocol**: Facebook and LinkedIn social sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing with large image cards
- **SEO Meta Tags**: Search engine optimization through structured metadata