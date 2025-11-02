// ==================== GitHub Projects Fetcher ====================
import type { Project, GitHubRepo, ProjectsData, LanguageColors, FilterType } from './types';
import { CONFIG } from './config';

export class GitHubPortfolio {
    private username: string;
    private projects: Project[] = [];
    private filteredProjects: Project[] = [];
    private includeOnlyRepos: string[] = [];

    constructor(username: string) {
        this.username = username;
    }

    async loadProjectsList(): Promise<void> {
        try {
            const response = await fetch(CONFIG.projectsFile);
            if (response.ok) {
                const data: ProjectsData = await response.json();
                this.includeOnlyRepos = data.projects || [];
            }
        } catch (error) {
            console.warn('Could not load projects.json, showing all repositories:', error);
            this.includeOnlyRepos = [];
        }
    }

    async fetchProjects(): Promise<Project[]> {
        try {
            const response = await fetch(
                `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const repos: GitHubRepo[] = await response.json();

            // Filter out forks and excluded repos, and optionally filter by includeOnlyRepos
            let filteredRepos = repos.filter(
                repo => !repo.fork && !CONFIG.excludeRepos.includes(repo.name)
            );
            
            // If includeOnlyRepos is specified and not empty, only show those repos
            if (this.includeOnlyRepos && this.includeOnlyRepos.length > 0) {
                filteredRepos = filteredRepos.filter(repo => 
                    this.includeOnlyRepos.includes(repo.name)
                );
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
                    return b.updated.getTime() - a.updated.getTime();
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

    filterProjects(filter: FilterType): Project[] {
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else if (filter === 'featured') {
            this.filteredProjects = this.projects.filter(project => project.isFeatured);
        }
        return this.filteredProjects;
    }

    renderProjects(projects: Project[]): void {
        const grid = document.getElementById('projectsGrid');
        
        if (!grid) return;

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
                <p class="project-description">${this.escapeHtml(project.description)}</p>
                ${project.language ? `
                    <div class="project-stats">
                        <span class="project-stat">
                            <i class="fas fa-circle" style="color: ${this.getLanguageColor(project.language)}"></i>
                            ${this.escapeHtml(project.language)}
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
                            <span class="topic-tag">${this.escapeHtml(topic)}</span>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="project-links">
                    <a href="${this.escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                    ${project.homepage ? `
                        <a href="${this.escapeHtml(project.homepage)}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    private formatRepoName(name: string): string {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    private getLanguageColor(language: string): string {
        const colors: LanguageColors = {
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

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
