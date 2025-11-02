// ==================== Main Application ====================
import { ThemeManager } from './theme';
import { GitHubPortfolio } from './portfolio';
import { CONFIG } from './config';
import type { FilterType } from './types';

// ==================== Smooth Scrolling ====================
function initializeSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (this: HTMLElement, e: Event) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ==================== Initialize Portfolio ====================
const portfolio = new GitHubPortfolio(CONFIG.githubUsername);

async function initializePortfolio(): Promise<void> {
    try {
        // Load the projects list from JSON file first
        await portfolio.loadProjectsList();
        // Then fetch and display projects
        const projects = await portfolio.fetchProjects();
        portfolio.renderProjects(projects);
        setupFilterButtons();
    } catch (error) {
        const grid = document.getElementById('projectsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading projects. Please check the GitHub username in config.ts</p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
            `;
        }
    }
}

function setupFilterButtons(): void {
    const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter and render projects
            const filter = button.getAttribute('data-filter') as FilterType;
            const filtered = portfolio.filterProjects(filter);
            portfolio.renderProjects(filtered);
        });
    });
}

// ==================== Set Current Year ====================
function setCurrentYear(): void {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear().toString();
    }
}

// ==================== Initialize on Load ====================
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    initializeSmoothScrolling();
    setCurrentYear();
    initializePortfolio();
});
