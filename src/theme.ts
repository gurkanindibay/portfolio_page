// ==================== Theme Toggle ====================

export class ThemeManager {
    private themeToggle: HTMLElement | null;
    private html: HTMLElement;

    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.html = document.documentElement;
        this.initialize();
    }

    private initialize(): void {
        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('theme') || 'light';
        this.html.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    private toggleTheme(): void {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    private updateThemeIcon(theme: string): void {
        const icon = this.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}
