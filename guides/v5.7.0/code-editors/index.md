During development, add Ember.js specific extensions to your code editor to expand functionality.
Below is a list of some of the extensions available,
many of which are created and maintained by the developer community:

## Visual Studio Code

Visual Studio Code is a code editor optimized for building and debugging modern web applications.
Visual Studio Code is one of the most popular text editors among Ember developers.

### Extension Pack

Install the extension pack to get everything you need to work on Ember.js projects.

[Ember.js Extension Pack](https://marketplace.visualstudio.com/items?itemName=EmberTooling.emberjs) - It will install the following addons

### Syntax Highlighting

[Glimmer Templates Syntax](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-glimmer-syntax) -
Syntax formatting for glimmer templates.

### Language Server

[Stable Ember Language Server](https://marketplace.visualstudio.com/items?itemName=lifeart.vscode-ember-unstable) -
Stable Ember Language Server is a stable, full-featured language server. Its name comes from its history as a fork of Ember Language Server and the efforts to keep up with changes in Ember.

### Workflow

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - Integrates ESLint into VS Code.

[EditorConfig for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) -
Attempts to override user/workspace settings with settings found in `.editorconfig` files.
The `.editorconfig` file helps developers define
and maintain consistent coding styles between different editors and IDEs.

[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) -
Prettier is an opinionated code formatting tool. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary. Prettier supports Handlebars, Ember and Glimmer out of the box.

### Typed Glimmer Templates

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        This is not installed as part of the extension pack but should be considered for Ember projects built with TypeScript. Learn more about <a href="https://typed-ember.gitbook.io/glint/">Glint here</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

[Glint](https://marketplace.visualstudio.com/items?itemName=typed-ember.glint-vscode) is a set of tools to aid in developing code that uses the Glimmer VM for rendering, such as Ember.js v3.24+ and GlimmerX projects.

## Vim and Neovim

Vim is a highly configurable text editor built to make creating and changing any kind of text very efficient.
It is included as "vi" with most UNIX systems and with Apple OS X.
Alternatively, Neovim is a hyper-extensible Vim-based text editor.
Both editors share a range of cross-compatible extensions listed below.

You'll want to remove any linter / completion manager you currently have installed
(or disable them for `.js`, `.ts` or `.hbs` files), and follow the install guides for the following packages:

### Syntax Highlighting

Only one of these solutions is needed, with tree-sitter being the highest fidelity.

[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) -
high-fidelity static highlighting with support for `.gjs` and `.gts` and embedded `hbs`.
Use `ensure_installed = { 'glimmer' }`.
Example `nvim-treesitter` config [can be found here](https://github.com/NullVoxPopuli/dotfiles/blob/main/home/.config/nvim/lua/plugins/syntax.lua#L15)

or

[vim-ember-hbs](https://github.com/joukevandermaas/vim-ember-hbs) -
Add Ember template syntax highlighting and indentation to Vim.
To get embedded highlighting will involve these additional plugins:

- [vim-javascript](https://github.com/pangloss/vim-javascript)
- [vim-js-pretty-template](https://github.com/Quramy/vim-js-pretty-template)

### Language Server

Only one of these solutions should be used at a time.

Native LSP with assistance from [Mason.nvim](https://github.com/williamboman/mason.nvim)
Easily install and manage LSP servers, DAP servers, linters, and formatters.
Example mason+LSP config [can be found here](https://github.com/NullVoxPopuli/dotfiles/tree/main/home/.config/nvim/lua)

or

[Conquer for Completion (COC) for Neovim](https://github.com/neoclide/coc.nvim) -
An IntelliSense engine which takes control over all linting, hinting, and language-server integration.
With the ember plugin [coc-ember](https://github.com/NullVoxPopuli/coc-ember) -
Ember.js language server extension including useful configuration instructions.

### Snippets / Workflow

[ember.vim](https://github.com/dsawardekar/ember.vim) -
Shortcuts to navigate related files with Ember.js projects.

[Ember Tools](https://github.com/AndrewRadev/ember_tools.vim) -
Various tools for working with Ember.js projects.

## Atom

Atom is hackable text editor for the 21st Century.

[atom-ide-ember](https://github.com/josa42/atom-ide-ember) -
Atom package to use the Ember Language Server.

[emberjs-atom](https://atom.io/packages/emberjs-atom) -
Atom autocomplete and snippets for Ember.js.

[atom-ember-snippets](https://github.com/mattmcmanus/atom-ember-snippets) -
Ember.js ES6, EmberData & Handlebars snippets for Atom editor.

[language-ember-htmlbars](https://atom.io/packages/language-ember-htmlbars) -
Add Ember template syntax highlighting and indentation to Atom

## Sublime Text

A sophisticated text editor for code, markup and prose.

[ember-cli-sublime-snippets](https://github.com/terminalvelocity/ember-cli-sublime-snippets) -
Ember CLI snippets for Sublime Text 3.

[ember-component-template-split-view](https://github.com/mmitchellgarcia/ember-component-template-split-view) -
Super simple Sublime Text plugin that will let you open corresponding template or route files with Ember.js components.
