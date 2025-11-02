# Developer & Architect Portfolio

A modern, responsive portfolio website built with TypeScript for showcasing your work as a Developer and Software Architect on GitHub Pages.

## Features

- 🎨 **Modern Design**: Clean, professional layout with smooth animations
- 🌓 **Dark/Light Mode**: Toggle between themes with preference saved locally
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🔄 **Dynamic Projects**: Automatically fetches your public non-fork GitHub repositories
- 🏷️ **Smart Filtering**: Filter projects by featured status
- ⭐ **Featured Projects**: Highlight your best work
- 🎯 **Skills Showcase**: Display your development and architecture expertise
- 🔗 **Social Links**: Easy access to your GitHub, LinkedIn, and email

## Quick Start

### 1. Configure Your Portfolio

Edit `script.js` and update the configuration:

```javascript
const CONFIG = {
    // Replace with your actual GitHub username
    githubUsername: 'YOUR_GITHUB_USERNAME',
    
    // Optional: Limit number of projects displayed (null = all projects)
    maxProjects: null,
    
    // Optional: Hide specific repositories
    excludeRepos: ['repo-name-to-hide'],
    
    // Optional: Mark repositories as featured (they appear first)
    featuredRepos: ['important-project', 'flagship-app'],
};
```

### 2. Update Personal Information

Edit `index.html` to add your information:

- Update the hero section with your name/title
- Modify the About section with your bio
- Update skills in the Skills section
- Add your social media links in the Contact section:
  - GitHub profile URL
  - LinkedIn profile URL
  - Email address

### 3. Deploy to GitHub Pages

#### Option A: Simple Deployment (Main Branch)

1. Create a new repository named `username.github.io` (replace `username` with your GitHub username)
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
   git push -u origin main
   ```
3. Visit `https://YOUR_USERNAME.github.io` (may take a few minutes)

#### Option B: Project Repository Deployment

1. Create a new repository (any name, e.g., `portfolio`)
2. Push this code to the repository
3. Go to repository Settings → Pages
4. Under "Source", select `main` branch and `/root` folder
5. Click Save
6. Visit `https://YOUR_USERNAME.github.io/REPOSITORY_NAME`

## Customization Guide

### Colors and Theming

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #3b82f6;      /* Main brand color */
    --secondary-color: #8b5cf6;    /* Secondary accent */
    /* ... more variables ... */
}
```

### Adding Custom Sections

Add new sections in `index.html` following this pattern:

```html
<section id="custom-section" class="custom-section">
    <div class="container">
        <h2 class="section-title">Section Title</h2>
        <!-- Your content here -->
    </div>
</section>
```

### Skills Configuration

Update the skills in the Skills section of `index.html`:

```html
<div class="skill-category">
    <div class="skill-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Category Name</h3>
    <ul>
        <li>Skill 1</li>
        <li>Skill 2</li>
    </ul>
</div>
```

## Project Filtering

The portfolio automatically:
- Excludes forked repositories
- Sorts projects by: Featured → Stars → Last Updated
- Displays project stats (stars, forks, language)
- Shows repository topics as tags
- Links to live demos if available

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript (ES6+)
- GitHub REST API
- Font Awesome Icons

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## GitHub API Rate Limiting

The GitHub API allows 60 requests per hour for unauthenticated requests. For higher limits:

1. Create a Personal Access Token (no scopes needed for public repos)
2. Modify the fetch request in `script.js`:

```javascript
const response = await fetch(
    `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`,
    {
        headers: {
            'Authorization': 'token YOUR_GITHUB_TOKEN'
        }
    }
);
```

## Tips for a Great Portfolio

1. **Add Descriptions**: Make sure your GitHub repositories have good descriptions
2. **Use Topics**: Add relevant topics/tags to your repositories
3. **Pin Projects**: Use the `featuredRepos` config to highlight your best work
4. **Add Homepages**: Include live demo URLs in your repository settings
5. **Keep Updated**: Regularly update your About and Skills sections
6. **Professional Bio**: Write a compelling bio that showcases both development and architecture skills

## License

Free to use for personal portfolios. Attribution appreciated but not required.

## Support

For issues or questions:
1. Check the GitHub API is accessible
2. Verify your GitHub username is correct in `script.js`
3. Check browser console for errors
4. Ensure repository visibility is set to public

---

Built with ❤️ for developers and architects
