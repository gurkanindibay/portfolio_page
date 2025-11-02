// ==================== Configuration ====================
const CONFIG = {
    // Replace with your GitHub username
    githubUsername: 'gurkanindibay',
    // Number of projects to display (set to null for all)
    maxProjects: null,
    // Repositories to exclude (add repository names you want to hide)
    excludeRepos: [],
    // Featured repositories (add repository names you want to highlight)
    featuredRepos: [],
    // Path to projects JSON file
    projectsFile: 'projects.json',
};

// ==================== Theme Toggle ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ==================== Smooth Scrolling ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== GitHub Projects Fetcher ====================
class GitHubPortfolio {
    constructor(username) {
        this.username = username;
        this.projects = [];
        this.filteredProjects = [];
        this.includeOnlyRepos = [];
    }

    async loadProjectsList() {
        try {
            const response = await fetch(CONFIG.projectsFile);
            if (response.ok) {
                const data = await response.json();
                this.includeOnlyRepos = data.projects || [];
            }
        } catch (error) {
            console.warn('Could not load projects.json, showing all repositories:', error);
            this.includeOnlyRepos = [];
        }
    }

    async fetchProjects() {
        try {
            const response = await fetch(
                `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const repos = await response.json();

            // Filter out forks and excluded repos, and optionally filter by includeOnlyRepos
            let filteredRepos = repos.filter(repo => !repo.fork && !CONFIG.excludeRepos.includes(repo.name));
            
            // If includeOnlyRepos is specified and not empty, only show those repos
            if (this.includeOnlyRepos && this.includeOnlyRepos.length > 0) {
                filteredRepos = filteredRepos.filter(repo => this.includeOnlyRepos.includes(repo.name));
            }

            this.projects = filteredRepos
                .map(repo => ({
                    name: repo.name,
                    description: repo.description || 'No description available',
                    url: repo.html_url,
                    homepage: repo.homepage,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    topics: repo.topics || [],
                    updated: new Date(repo.updated_at),
                    isFeatured: CONFIG.featuredRepos.includes(repo.name)
                }))
                .sort((a, b) => {
                    // Sort featured projects first
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    // Then by stars
                    if (b.stars !== a.stars) return b.stars - a.stars;
                    // Then by update date
                    return b.updated - a.updated;
                });

            if (CONFIG.maxProjects) {
                this.projects = this.projects.slice(0, CONFIG.maxProjects);
            }

            this.filteredProjects = [...this.projects];
            return this.projects;
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            throw error;
        }
    }

    filterProjects(filter) {
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else if (filter === 'featured') {
            this.filteredProjects = this.projects.filter(project => project.isFeatured);
        }
        return this.filteredProjects;
    }

    renderProjects(projects) {
        const grid = document.getElementById('projectsGrid');
        
        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="loading">
                    <i class="fas fa-folder-open"></i>
                    <p>No projects found</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = projects.map(project => `
            <div class="project-card" data-featured="${project.isFeatured}">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${this.formatRepoName(project.name)}</h3>
                    </div>
                    <div class="project-icon">
                        <i class="fas fa-folder${project.isFeatured ? ' fa-star' : ''}"></i>
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                ${project.language ? `
                    <div class="project-stats">
                        <span class="project-stat">
                            <i class="fas fa-circle" style="color: ${this.getLanguageColor(project.language)}"></i>
                            ${project.language}
                        </span>
                        <span class="project-stat">
                            <i class="fas fa-star"></i>
                            ${project.stars}
                        </span>
                        <span class="project-stat">
                            <i class="fas fa-code-branch"></i>
                            ${project.forks}
                        </span>
                    </div>
                ` : ''}
                ${project.topics.length > 0 ? `
                    <div class="project-topics">
                        ${project.topics.slice(0, 5).map(topic => `
                            <span class="topic-tag">${topic}</span>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="project-links">
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                    ${project.homepage ? `
                        <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    formatRepoName(name) {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C#': '#178600',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Ruby': '#701516',
            'PHP': '#4F5D95',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Shell': '#89e051',
        };
        return colors[language] || '#8b949e';
    }
}

// ==================== Initialize Portfolio ====================
const portfolio = new GitHubPortfolio(CONFIG.githubUsername);

async function initializePortfolio() {
    try {
        // Load the projects list from JSON file first
        await portfolio.loadProjectsList();
        // Then fetch and display projects
        const projects = await portfolio.fetchProjects();
        portfolio.renderProjects(projects);
        setupFilterButtons();
    } catch (error) {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading projects. Please check the GitHub username in script.js</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Error: ${error.message}</p>
            </div>
        `;
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter and render projects
            const filter = button.getAttribute('data-filter');
            const filtered = portfolio.filterProjects(filter);
            portfolio.renderProjects(filtered);
        });
    });
}

// ==================== Set Current Year ====================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ==================== Initialize on Load ====================
document.addEventListener('DOMContentLoaded', initializePortfolio);
