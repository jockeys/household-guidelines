document.addEventListener('DOMContentLoaded', () => {
    const infographicPage = document.getElementById('infographic-page');
    const interactiveAppPage = document.getElementById('interactive-app-page');
    const exploreInteractiveBtn = document.getElementById('explore-interactive-btn');
    const backToInfographicBtn = document.getElementById('back-to-infographic-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    // Function to show a specific page (infographic or interactive app)
    function showPage(pageId) {
        if (pageId === 'infographic-page') {
            infographicPage.classList.add('active');
            interactiveAppPage.classList.remove('active');
        } else if (pageId === 'interactive-app-page') {
            infographicPage.classList.remove('active');
            interactiveAppPage.classList.add('active');
            // Ensure interactive app starts at philosophy section when navigated to
            updateInteractiveNav('#interactive-philosophy');
        }
        window.scrollTo(0, 0); // Scroll to top when switching pages
    }

    // Function to set the theme (light or dark)
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.textContent = '🌙'; // Moon icon for dark mode
            themeText.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.textContent = '☀️'; // Sun icon for light mode
            themeText.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        }
        // Re-render charts to apply new theme colors if they use CSS variables
        if (window.infographicChart) window.infographicChart.update();
        if (window.interactiveChart) window.interactiveChart.update();
    }

    // Check for saved theme preference on load, or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light'); // Default to light mode
    }

    // Event listener for theme toggle button
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // Event listener for "Explore Interactive Guidelines" button
    exploreInteractiveBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        showPage('interactive-app-page'); // Switch to interactive app page
    });

    // Event listener for "Back to Infographic" button
    backToInfographicBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        showPage('infographic-page'); // Switch back to infographic page
    });

    // Initial page load based on URL hash or default to infographic
    if (window.location.hash === '#interactive-app-section') {
        showPage('interactive-app-page');
    } else {
        showPage('infographic-page');
    }

    // --- Infographic Chart Logic (for the landing page) ---
    const infographicScreenTimeCtx = document.getElementById('infographicScreenTimeChart');
    if (infographicScreenTimeCtx) {
        const infographicScreenTimeData = {
            labels: [['18-24 Months'], ['Ages 6-9']],
            datasets: [{
                label: 'Max Daily Screen Time (Hours)',
                data: [1, 2],
                backgroundColor: [
                    'var(--chart-bg-1)',
                    'var(--chart-bg-2)',
                ],
                borderColor: [
                    'var(--chart-border-1)',
                    'var(--chart-border-2)'
                ],
                borderWidth: 2,
                borderRadius: 8,
            }]
        };

        window.infographicChart = new Chart(infographicScreenTimeCtx, {
            type: 'bar',
            data: infographicScreenTimeData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Horizontal bars
                plugins: {
                    legend: {
                        display: false // Hide legend
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'var(--header-bg)',
                        titleFont: { weight: 'bold' },
                        bodyFont: { size: 12 },
                        displayColors: false,
                        callbacks: {
                            title: function(tooltipItems) {
                                const item = tooltipItems[0];
                                let label = item.chart.data.labels[item.dataIndex];
                                if (Array.isArray(label)) {
                                    return label.join(' ');
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                // Custom text for tooltips based on data index
                                if (context[0].dataIndex === 0) {
                                    return [
                                        'Guideline: High-quality programs only.',
                                        'Parent must watch WITH the child.',
                                    ];
                                } else if (context[0].dataIndex === 1) {
                                    return [
                                        'Guideline: Quality content is key.',
                                        'Screen-free bedrooms & dining table.'
                                    ];
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours per Day',
                            font: {
                                size: 14,
                                weight: 'bold',
                                color: 'var(--main-text)' // Ensure chart text changes color
                            }
                        },
                        ticks: {
                            stepSize: 0.5,
                            color: 'var(--main-text)' // Ensure chart ticks change color
                        }
                    },
                    y: {
                        grid: {
                            display: false // Hide y-axis grid lines
                        },
                        ticks: {
                            font: {
                                size: 14,
                                weight: 'bold',
                                color: 'var(--main-text)' // Ensure chart ticks change color
                            },
                            color: 'var(--main-text)' // Ensure chart ticks change color
                        }
                    }
                }
            }
        });
    }

    // --- Interactive App Logic (for the internal app section) ---
    const interactiveNavLinks = document.querySelectorAll('.interactive-sidebar-nav-item, .interactive-mobile-nav-item');
    const interactiveContentSections = document.querySelectorAll('.interactive-content-section');
    const interactiveMobileNavItems = document.querySelectorAll('.interactive-mobile-nav-item');

    // Function to update the active navigation link and show the corresponding content section
    function updateInteractiveNav(hash) {
        // Update sidebar navigation active state
        document.querySelectorAll('.interactive-sidebar-nav-item').forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update mobile navigation styling
        interactiveMobileNavItems.forEach(link => {
            const icon = link.querySelector('span:first-child');
            const text = link.querySelector('span:last-child');
            if (link.getAttribute('href') === hash) {
                link.style.color = '#073B4C'; // Dark blue for active mobile nav item
                text.style.fontWeight = '600'; // Bold text for active mobile nav item
            } else {
                link.style.color = '#4F4A45'; // Gray for inactive mobile nav item
                text.style.fontWeight = '400'; // Normal text for inactive mobile nav item
            }
        });

        // Show/hide content sections
        interactiveContentSections.forEach(section => {
            if ('#' + section.id === hash) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        // Scroll to the top of the interactive app section when navigating within it
        const interactiveAppSection = document.getElementById('interactive-app-page');
        if (interactiveAppSection) {
            interactiveAppSection.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Event handler for interactive navigation links
    function handleInteractiveNavigation(e) {
        e.preventDefault(); // Prevent default link behavior
        const hash = e.currentTarget.getAttribute('href');
        updateInteractiveNav(hash); // Update navigation and content
    }

    // Add event listeners to all interactive navigation links
    interactiveNavLinks.forEach(link => {
        link.addEventListener('click', handleInteractiveNavigation);
    });

    // Accordion functionality for Parenting Toolkit cards
    const interactiveFrameworkCards = document.querySelectorAll('.interactive-framework-card');
    interactiveFrameworkCards.forEach(card => {
        const header = card.querySelector('.interactive-framework-header');
        const icon = header.querySelector('span');
        header.addEventListener('click', () => {
            const wasOpen = card.classList.contains('open');
            // Close all other open cards first
            interactiveFrameworkCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('open')) {
                    otherCard.classList.remove('open');
                    otherCard.querySelector('.interactive-framework-header span').style.transform = 'rotate(0deg)';
                }
            });
            // Toggle current card
            if (!wasOpen) {
                card.classList.add('open');
                icon.style.transform = 'rotate(90deg)';
            } else {
                card.classList.remove('open');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Chart.js for Screen Time in interactive app
    const interactiveScreenTimeCtx = document.getElementById('interactiveScreenTimeChart');
    if (interactiveScreenTimeCtx) {
        const interactiveScreenTimeData = {
            labels: ['18-24 Months', 'Ages 6-9'],
            datasets: [{
                label: 'Max Recommended Daily Screen Time (Hours)',
                data: [1, 2],
                backgroundColor: [
                    'rgba(168, 163, 152, 0.6)', // Grayish color
                    'rgba(228, 213, 199, 0.8)', // Lighter grayish color
                ],
                borderColor: [
                    'rgb(168, 163, 152)',
                    'rgb(228, 213, 199)',
                ],
                borderWidth: 1
            }]
        };

        window.interactiveChart = new Chart(interactiveScreenTimeCtx, {
            type: 'bar',
            data: interactiveScreenTimeData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                const item = tooltipItems[0];
                                let label = item.chart.data.labels[item.dataIndex];
                                if (Array.isArray(label)) {
                                    return label.join(' ');
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                if (context[0].dataIndex === 0) {
                                    return [
                                        'Guideline: High-quality programming.',
                                        'Parent must watch WITH the child.',
                                        'No unsupervised media use.'
                                    ];
                                } else if (context[0].dataIndex === 1) {
                                    return [
                                        'Priority: Outdoor play, reading, social time.',
                                        'Content: Educational or creative focus.',
                                        'Zones: Screen-free bedrooms & dining table.'
                                    ];
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours per Day'
                        },
                        ticks: {
                            stepSize: 0.5
                        }
                    }
                }
            }
        });
    }
});
