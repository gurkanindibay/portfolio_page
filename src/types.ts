// ==================== Type Definitions ====================

export interface Config {
    githubUsername: string;
    maxProjects: number | null;
    excludeRepos: string[];
    featuredRepos: string[];
    projectsFile: string;
    filtersFile: string;
}

export interface ProjectsData {
    projects: ProjectData[];
}

export interface ProjectData {
    name: string;
    technologies?: string[];
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics: string[];
    updated_at: string;
    fork: boolean;
}

export interface Project {
    name: string;
    description: string;
    url: string;
    homepage: string | null;
    stars: number;
    forks: number;
    language: string | null;
    topics: string[];
    updated: Date;
    isFeatured: boolean;
}

export interface FilterData {
    name: string;
    value: string;
}

export interface FiltersData {
    filters: FilterData[];
}

export interface LanguageColors {
    [key: string]: string;
}
