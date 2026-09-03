// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "news-presented-a-tutorial-at-coling-2025",
          title: 'Presented a tutorial at COLING 2025.',
          description: "",
          section: "News",},{id: "news-serving-as-website-chair-for-emnlp-2025",
          title: 'Serving as Website Chair for EMNLP 2025.',
          description: "",
          section: "News",},{id: "news-obtained-a-grant-in-aid-for-early-career-scientists",
          title: 'Obtained a Grant-in-Aid for Early-Career Scientists!',
          description: "",
          section: "News",},{id: "news-organizing-the-english-indic-language-document-translation-task-at-wat-2025",
          title: 'Organizing the English-Indic Language Document Translation Task at WAT 2025.',
          description: "",
          section: "News",},{id: "news-one-paper-accepted-to-emnlp-2025-findings",
          title: 'One paper accepted to EMNLP 2025 Findings!',
          description: "",
          section: "News",},{id: "news-four-papers-accepted-to-ijcnlp-aacl-2025-three-main-one-system-demonstrations",
          title: 'Four papers accepted to IJCNLP-AACL 2025 (three Main, one System Demonstrations)!',
          description: "",
          section: "News",},{id: "news-three-papers-accepted-to-emnlp-2026-one-main-two-findings",
          title: 'Three papers accepted to EMNLP 2026 (one Main, two Findings)!',
          description: "",
          section: "News",},{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=IP5UyqcAAAAJ&sortby=pubdate", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/shyyhs", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/haiyue-song-844a74186", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/shyoyhs", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%68%61%69%79%75%65.%73%6F%6E%67.%6E%6C%70@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
