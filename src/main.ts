// ==================== Main Application ====================
import { ThemeManager } from './theme';
import { GitHubPortfolio } from './portfolio';
import { CONFIG } from './config';
import type { FiltersData, FilterData } from './types';

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

// ==================== Load Filters ====================
async function loadFilters(): Promise<FilterData[]> {
    try {
        const response = await fetch(CONFIG.filtersFile);
        if (response.ok) {
            const data: FiltersData = await response.json();
            return data.filters || [];
        }
    } catch (error) {
        console.warn('Could not load filters.json, using default filters:', error);
    }
    // Default filters
    return [
        { name: 'All', value: 'all' },
        { name: 'Featured', value: 'featured' }
    ];
}

// ==================== Create Filter Buttons ====================
function createFilterButtons(filters: FilterData[]): void {
    const filterContainer = document.querySelector('.projects-filter');
    if (!filterContainer) return;

    filterContainer.innerHTML = filters.map((filter, index) => `
        <button class="filter-btn${index === 0 ? ' active' : ''}" data-filter="${filter.value}">${filter.name}</button>
    `).join('');
}

// ==================== Initialize Portfolio ====================
const portfolio = new GitHubPortfolio(CONFIG.githubUsername);

async function initializePortfolio(): Promise<void> {
    try {
        // Load the projects list from JSON file first
        await portfolio.loadProjectsList();
        // Load filters
        const filters = await loadFilters();
        // Create filter buttons
        createFilterButtons(filters);
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
            const filter = button.getAttribute('data-filter') as string;
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
