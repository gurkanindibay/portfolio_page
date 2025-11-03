// ==================== Configuration ====================
import type { Config } from './types';

export const CONFIG: Config = {
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
    // Path to filters JSON file
    filtersFile: 'filters.json',
};
