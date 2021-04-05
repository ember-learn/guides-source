function createPages() {
  return [
    {
      id: 'toc-heading_introduction',
      isHeading: true,
      skipToc: false,
      title: 'Introduction',
    },

    {
      id: 'index',
      isHeading: false,
      pages: [
        {
          title: 'Ember.js Guides',
          url: 'index/',
        },
      ],
      skipToc: true,
      title: 'Guides and Tutorials',
    },

    {
      id: 'getting-started',
      isHeading: false,
      pages: [
        {
          title: 'How To Use The Guides',
          url: 'getting-started/index',
        },
        {
          title: 'Quick Start',
          url: 'getting-started/quick-start',
        },
        {
          title: 'Working with HTML, CSS, and JavaScript',
          url: 'getting-started/working-with-html-css-and-javascript',
        },
        {
          title: 'Anatomy of an Ember App',
          url: 'getting-started/anatomy-of-an-ember-app',
        },
      ],
      skipToc: false,
      title: 'Getting Started',
    },

    {
      id: 'tutorial',
      isHeading: false,
      pages: [
        {
          pages: [
            {
              title: 'Introduction',
              url: 'tutorial/part-1/index',
            },
            {
              title: 'Orientation',
              url: 'tutorial/part-1/orientation',
            },
            {
              title: 'Building Pages',
              url: 'tutorial/part-1/building-pages',
            },
            {
              title: 'Automated Testing',
              url: 'tutorial/part-1/automated-testing',
            },
            {
              title: 'Component Basics',
              url: 'tutorial/part-1/component-basics',
            },
            {
              title: 'More About Components',
              url: 'tutorial/part-1/more-about-components',
            },
            {
              title: 'Interactive Components',
              url: 'tutorial/part-1/interactive-components',
            },
            {
              title: 'Reusable Components',
              url: 'tutorial/part-1/reusable-components',
            },
            {
              title: 'Working With Data',
              url: 'tutorial/part-1/working-with-data',
            },
            {
              title: 'Recap',
              url: 'tutorial/part-1/recap',
            },
          ],
          title: 'Part 1',
          url: 'tutorial/part-1',
        },

        {
          pages: [
            {
              title: 'Introduction',
              url: 'tutorial/part-2/index',
            },
            {
              title: 'Route Params',
              url: 'tutorial/part-2/route-params',
            },
            {
              title: 'Service Injection',
              url: 'tutorial/part-2/service-injection',
            },
            {
              title: 'Ember Data',
              url: 'tutorial/part-2/ember-data',
            },
            {
              title: 'Provider Components',
              url: 'tutorial/part-2/provider-components',
            },
            {
              title: 'Recap',
              url: 'tutorial/part-2/recap',
            },
          ],
          title: 'Part 2',
          url: 'tutorial/part-2',
        },
      ],
      skipToc: false,
      title: 'Tutorial',
    },

    {
      id: 'toc-heading_core-concepts',
      isHeading: true,
      skipToc: false,
      title: 'Core Concepts',
    },

    {
      id: 'components',
      isHeading: false,
      pages: [
        {
          title: 'Templates are HTML',
          url: 'components/index',
        },
        {
          title: 'Introducing Components',
          url: 'components/introducing-components',
        },
        {
          title: 'Component Arguments and HTML Attributes',
          url: 'components/component-arguments-and-html-attributes',
        },
        {
          title: 'Conditional Content',
          url: 'components/conditional-content',
        },
        {
          title: 'Block Content',
          url: 'components/block-content',
        },
        {
          title: 'Helper Functions',
          url: 'components/helper-functions',
        },
        {
          title: 'Component State and Actions',
          url: 'components/component-state-and-actions',
        },
        {
          title: 'Looping Through Lists',
          url: 'components/looping-through-lists',
        },
        {
          title: 'Template Lifecycle, DOM, and Modifiers',
          url: 'components/template-lifecycle-dom-and-modifiers',
        },
        {
          title: 'Built-in Components',
          url: 'components/built-in-components',
        },
      ],
      skipToc: false,
      title: 'Components',
    },

    {
      id: 'routing',
      isHeading: false,
      pages: [
        {
          title: 'Introduction',
          url: 'routing/index',
        },
        {
          title: 'Defining Your Routes',
          url: 'routing/defining-your-routes',
        },
        {
          title: 'Linking Between Routes',
          url: 'routing/linking-between-routes',
        },
        {
          title: "Specifying a Route's Model",
          url: 'routing/specifying-a-routes-model',
        },
        {
          title: 'Rendering a Template',
          url: 'routing/rendering-a-template',
        },
        {
          title: 'Redirecting',
          url: 'routing/redirection',
        },
        {
          'is-advanced': true,
          title: 'Preventing and Retrying Transitions',
          url: 'routing/preventing-and-retrying-transitions',
        },
        {
          'is-advanced': true,
          title: 'Loading / Error Substates',
          url: 'routing/loading-and-error-substates',
        },
        {
          title: 'Query Parameters',
          url: 'routing/query-params',
        },
        {
          'is-advanced': true,
          title: 'Asynchronous Routing',
          url: 'routing/asynchronous-routing',
        },
        {
          title: 'Controllers',
          url: 'routing/controllers',
        },
      ],
      skipToc: false,
      title: 'Routing',
    },

    {
      id: 'services',
      isHeading: false,
      pages: [
        {
          title: 'Overview',
          url: 'services/index',
        },
      ],
      skipToc: false,
      title: 'Services',
    },

    {
      id: 'models',
      isHeading: false,
      pages: [
        {
          title: 'Introduction',
          url: 'models/index',
        },
        {
          title: 'Defining Models',
          url: 'models/defining-models',
        },
        {
          title: 'Finding Records',
          url: 'models/finding-records',
        },
        {
          title: 'Creating, Updating and Deleting',
          url: 'models/creating-updating-and-deleting-records',
        },
        {
          title: 'Relationships',
          url: 'models/relationships',
        },
        {
          'is-advanced': true,
          title: 'Pushing Records into the Store',
          url: 'models/pushing-records-into-the-store',
        },
        {
          'is-advanced': true,
          title: 'Handling Metadata',
          url: 'models/handling-metadata',
        },
        {
          'is-advanced': true,
          title: 'Customizing Adapters',
          url: 'models/customizing-adapters',
        },
        {
          'is-advanced': true,
          title: 'Customizing Serializers',
          url: 'models/customizing-serializers',
        },
      ],
      skipToc: false,
      title: 'Ember Data',
    },

    {
      id: 'in-depth-topics',
      isHeading: false,
      pages: [
        {
          title: 'Autotracking In-Depth',
          url: 'in-depth-topics/autotracking-in-depth',
        },
        {
          title: 'Patterns for Components',
          url: 'in-depth-topics/patterns-for-components',
        },
        {
          title: 'Patterns for Actions',
          url: 'in-depth-topics/patterns-for-actions',
        },
        {
          title: 'Making API Requests',
          url: 'in-depth-topics/making-api-requests',
        },
        {
          title: 'Native Classes In-Depth',
          url: 'in-depth-topics/native-classes-in-depth',
        },
      ],
      skipToc: false,
      title: 'In-Depth Topics',
    },

    {
      id: 'toc-heading_application-development',
      isHeading: true,
      skipToc: false,
      title: 'Application Development',
    },

    {
      id: 'applications',
      isHeading: false,
      pages: [
        {
          'is-advanced': true,
          title: 'Applications and Instances',
          url: 'applications/index',
        },
        {
          'is-advanced': true,
          title: 'Dependency Injection',
          url: 'applications/dependency-injection',
        },
        {
          'is-advanced': true,
          title: 'Initializers',
          url: 'applications/initializers',
        },
        {
          'is-advanced': true,
          title: 'The Run Loop',
          url: 'applications/run-loop',
        },
        {
          'is-advanced': true,
          title: 'Ember Engines',
          url: 'applications/ember-engines',
        },
      ],
      skipToc: false,
      title: 'Application Concerns',
    },

    {
      id: 'accessibility',
      isHeading: false,
      pages: [
        {
          title: 'Intro to Accessibility',
          url: 'accessibility/index',
        },
        {
          title: 'Application Considerations',
          url: 'accessibility/application-considerations',
        },
        {
          title: 'Page Template Considerations',
          url: 'accessibility/page-template-considerations',
        },
        {
          title: 'Component Considerations',
          url: 'accessibility/components',
        },
        {
          title: 'Testing Considerations',
          url: 'accessibility/testing',
        },
        {
          title: 'Learning Resources',
          url: 'accessibility/learning-resources',
        },
      ],
      skipToc: false,
      title: 'Accessibility',
    },

    {
      id: 'configuring-ember',
      isHeading: false,
      pages: [
        {
          title: 'Configuring Your App',
          url: 'configuring-ember/index',
        },
        {
          title: 'Configuring Ember CLI',
          url: 'configuring-ember/configuring-ember-cli',
        },
        {
          title: 'Handling Deprecations',
          url: 'configuring-ember/handling-deprecations',
        },
        {
          title: 'Disabling Prototype Extensions',
          url: 'configuring-ember/disabling-prototype-extensions',
        },
        {
          title: 'Specifying the URL Type',
          url: 'configuring-ember/specifying-url-type',
        },
        {
          title: 'Embedding Applications',
          url: 'configuring-ember/embedding-applications',
        },
        {
          'is-advanced': true,
          title: 'Feature Flags',
          url: 'configuring-ember/feature-flags',
        },
        {
          'is-advanced': true,
          title: 'Optional Features',
          url: 'configuring-ember/optional-features',
        },
        {
          title: 'Build targets',
          url: 'configuring-ember/build-targets',
        },
        {
          title: 'Debugging',
          url: 'configuring-ember/debugging',
        },
      ],
      skipToc: false,
      title: 'Configuration',
    },

    {
      id: 'testing',
      isHeading: false,
      pages: [
        {
          title: 'Introduction',
          url: 'testing/index',
        },
        {
          title: 'Test Types',
          url: 'testing/test-types',
        },
        {
          title: 'Testing Application',
          url: 'testing/testing-application',
        },
        {
          title: 'Testing Basics',
          url: 'testing/unit-testing-basics',
        },
        {
          title: 'Testing Components',
          url: 'testing/testing-components',
        },
        {
          title: 'Testing Helpers',
          url: 'testing/testing-helpers',
        },
        {
          title: 'Testing Controllers',
          url: 'testing/testing-controllers',
        },
        {
          title: 'Testing Routes',
          url: 'testing/testing-routes',
        },
        {
          title: 'Testing Models',
          url: 'testing/testing-models',
        },
      ],
      skipToc: false,
      title: 'Testing',
    },

    {
      id: 'addons-and-dependencies',
      isHeading: false,
      pages: [
        {
          title: 'Managing Dependencies',
          url: 'addons-and-dependencies/index',
        },
      ],
      skipToc: false,
      title: 'Addons and Dependencies',
    },

    {
      id: 'toc-heading_developer-tools',
      isHeading: true,
      skipToc: false,
      title: 'Developer Tools',
    },

    {
      id: 'ember-inspector',
      isHeading: false,
      pages: [
        {
          title: 'Introduction',
          url: 'ember-inspector/index',
        },
        {
          title: 'Installing the Inspector',
          url: 'ember-inspector/installation',
        },
        {
          title: 'Object Inspector',
          url: 'ember-inspector/object-inspector',
        },
        {
          title: 'The Component Tree',
          url: 'ember-inspector/component-tree',
        },
        {
          title: 'Inspecting Routes',
          url: 'ember-inspector/routes',
        },
        {
          title: 'Data Tab',
          url: 'ember-inspector/data',
        },
        {
          title: 'Tackling Deprecations',
          url: 'ember-inspector/deprecations',
        },
        {
          title: 'Library Info',
          url: 'ember-inspector/info',
        },
        {
          title: 'Debugging Promises',
          url: 'ember-inspector/promises',
        },
        {
          title: 'Inspecting Objects via the Container',
          url: 'ember-inspector/container',
        },
        {
          title: 'Rendering Performance',
          url: 'ember-inspector/render-performance',
        },
        {
          title: 'Troubleshooting',
          url: 'ember-inspector/troubleshooting',
        },
      ],
      skipToc: false,
      title: 'Ember Inspector',
    },

    {
      id: 'code-editors',
      isHeading: false,
      pages: [
        {
          title: 'Ember Extensions',
          url: 'code-editors/index',
        },
      ],
      skipToc: false,
      title: 'Code Editors',
    },

    {
      id: 'toc-heading_additional-resources',
      isHeading: true,
      skipToc: false,
      title: 'Additional Resources',
    },

    {
      id: 'upgrading',
      isHeading: false,
      pages: [
        {
          title: 'How to upgrade',
          url: 'upgrading/index',
        },

        {
          pages: [
            {
              title: 'Introduction',
              url: 'upgrading/current-edition/index',
            },
            {
              title: 'Templates',
              url: 'upgrading/current-edition/templates',
            },
            {
              title: 'Native Classes',
              url: 'upgrading/current-edition/native-classes',
            },
            {
              title: 'Tracked Properties',
              url: 'upgrading/current-edition/tracked-properties',
            },
            {
              title: '@action, {{on}} and {{fn}}',
              url: 'upgrading/current-edition/action-on-and-fn',
            },
            {
              title: 'Glimmer Components',
              url: 'upgrading/current-edition/glimmer-components',
            },
            {
              title: 'Cheat Sheet',
              url: 'upgrading/current-edition/cheat-sheet',
            },
          ],
          title: 'Octane Upgrade Guide',
          url: 'upgrading/current-edition',
        },
      ],
      skipToc: false,
      title: 'Upgrading',
    },

    {
      id: 'contributing',
      isHeading: false,
      pages: [
        {
          title: 'Overview',
          url: 'contributing/index',
        },
        {
          title: 'Adding New Features',
          url: 'contributing/adding-new-features',
        },
        {
          title: 'Repositories',
          url: 'contributing/repositories',
        },
      ],
      skipToc: false,
      title: 'Contributing to Ember.js',
    },

    {
      id: 'glossary',
      isHeading: false,
      pages: [
        {
          title: 'Web Development',
          url: 'glossary/index',
        },
      ],
      skipToc: false,
      title: 'Glossary',
    },
  ];
}

export { createPages };
