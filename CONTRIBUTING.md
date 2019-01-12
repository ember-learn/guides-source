# Contributing

The Ember Guides are maintained and updated by an all-volunteer group of Ember community members. We'd love to have you join our efforts! Here are a few ways you can help:

* _Fixing problems_: If you find a problem on a particular page in the Guides, the most helpful thing you can do is open a pull request. If you're not sure how to fix it, open an issue.
* _Contributing requested content_: We try to make it easy for people to contribute to the Guides by tagging issues with [help wanted](https://github.com/ember-learn/guides-source/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) when appropriate. The best way to get started contributing content is to pick up one of these issues.
Add a comment to let the maintainers know that you're interested, and post any questions you may have.
* _Contributing unsolicited content_: If you'd like to contribute content that you think is missing, please start by checking the issues page. There may already be a plan to add this content! If not, open an issue yourself so that you can get feedback before you start writing. Our core contributors may ask you to start off by writing a blog post on your topic instead of or before opening a pull request on the Guides. This helps us keep the Guides consistent and streamlined.
* _Writing infrastructure code_: You can also help out with the Guides by improving the code for the app that is used to build the content. Issues related to writing infrastructure code and layout should be made on the [guides-app](https://github.com/ember-learn/guides-app) repository.

Please note that no attempt is made to update content for older versions of the Guides. Except for broken links, they are considered static and immutable, as it is too difficult to maintain content for every version ever released. Issues will only be fixed for future releases.

## Making Your First Pull Request

First-time contributors are encouraged to choose issues that are labeled 
"help wanted" or "good for new contributors." If you have questions, want a
suggestion of what to work on, or would like a buddy to pair with, you can 
join the #-team-learning channel in the 
[Ember Community Discord](https://discordapp.com/invite/zT3asNS).

Fork this repository (click "fork" on the repository's home page in GitHub)

Clone the forked repository with `git clone <your fork's url>` and create a
branch with `git checkout -b some-branch-name`.

As you make commits, reference the issue number in your commit message, such as
`git commit -m "add glasses to nearsighted hamster (#6217)"`

Once you're at the point that you'd like feedback, submit a Pull Request (new
Pull Request button). Choose `master` for the base and your branch name for `compare`,
then submit it!

Your PR will be reviewed by another contributor, and then either merged or have
changes requested.

## Keeping your fork updated

As you tackle new Issues, you'll want to be sure that you always start by working
on the most recent code. To sync up your fork's  `master` with a parent repository's
master, set an upstream and pull from it. For this to work, you should make sure
you're always committing to a branch, not master.

```
git remote add upstream https://github.com/ember-learn/guides-source.git
git checkout master
git pull upstream master
```

## Style Guide

Before you open a PR with anything but a minor fix, please familiarize yourself with this style guide so that we can ensure a high quality, consistent style of writing throughout the documentation.

- The **Guides** refers to the entire Ember Guides project. Here, _Guides_ is capitalized.
- A **guide** is one page of the Guides, for example "Defining Your Routes". Here, _guide_ is lowercase.
- A **section** is one of the top-level grouping of several guides, for example "Routing".

Write in complete sentences. Use a friendly tone of voice. Use American English. Use gender-neutral pronouns - for example, "Is the user logged in? Are _they_ an admin user?" Use title case for all titles and headers. If English is not your native language and you aren't sure about any of these, don't hesitate to ask for help in your pull request!

Be as brief as possible, but don't sacrifice clarity for brevity. If a guide is more than a couple screens of scrolling, consider breaking it into multiple pages.

The target audience of the Guides are developers whose skills range from beginner developer with perhaps some jQuery experience, to experienced Ember developer learning about a new feature. Be sure to write content that covers both of their needs: keep explanations thorough enough for the beginner, while including more advanced topics for the experienced developer.

The Guides are primarily meant to cover the "Ember happy path", and are not intended to be comprehensive. Leave edge cases and rarely-used features to the API documentation. Start each guide and each section with the simplest, most commonly-used features, and progress to the more advanced and less commonly-used features.

Each guide should thoroughly explain the feature it documents, and include links to the API documentation. Links to authoritative sources of information on background concepts are also encouraged: for example, the _Handlebars Basics_ guide appropriately links to http://handlebarsjs.com/. Do not link to other outside content like blog posts or meetup slides, as reviewing and updating this content is better suited for content aggregators.

Liberally use examples in your writing. For example, the sentence "Templates can contain expressions in double curly braces" should be expanded to something like "Templates can contain expressions in double curly braces, such as \`&lt;h1&gt;Welcome {{user.name}}&lt;/h1&gt;\`" A short example is often more clear than a long explanation. In fact, it is often helpful to give two examples to make things even clearer.

When writing prose:

* Use a single space after periods.
* Manually break lines:
  * at the beginning of every new sentence;
  * after the last comma in sentences over 120 characters; or
  * after logical statements in sentences over 120 characters with no commas.

In code samples:

* Follow the [Ember Style Guide](https://github.com/emberjs/ember.js/blob/master/STYLEGUIDE.md).
* Use double-quotes in templates, i.e., `<div class="awesome">{{foo-bar title="Tomster"}}</div>`.
* In [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/), write paths relative to the project root. e.g., `app/router.js`, `config/environment.js`
* When writing a fenced code block with a filename, do so by writing the language name first followed by the file name within a data-filename block as shown below,

\`\`\` javascript {data-filename="app/router.js"}

\`\`\`

* When writing a fenced code block with diffs, do so by writing the patch information within a data-diff block as shown below,

\`\`\` javascript {data-filename="app/router.js" data-diff="-2,+3"}

\`\`\`

* All fenced code blocks should begin with a language code supported by [prism.js](http://prismjs.com/) so that they get highlighted properly when rendered. Here are some frequently used language codes,
  * bash
  * javascript
  * css
  * handlebars

When linking to topics from guide md files:

* use relative links when referencing a topic.
  * Incorrect: `https://guides.emberjs.com/release/routing/query-params/`
  * Correct: `../routing/query-params`

* to reference a topic when you are in `index.md`, you only have to go up one level to reference another topics md file, `../main-topic/sub-topic`.
  * example from `index.md` to `routing/query-params.md`:
    * `../routing/query-params`

* to reference a md file in a different main topic to the one you are in, you need to go two levels up, `../../main-topic/sub-topic`.
  * example from `routing/query-params.md` to `components/block-params.md`:
    * `../../components/block-params`

* to reference a md file within the topic you are currently in, you need to go up one level, `../sub-topic`.
  * example from `routing/query-params.md` to `routing/redirection.md`:
    * `../redirection`

* always use `/release/` when linking API docs.

When linking to API pages:

* use code backticks as part of the link text, i.e., \[<code>&#96;store.push()&#96;</code>]
(api link)
* include parenthesis when linking to an API method, i.e., <code>&#96;store.push()&#96;</code>

## Spellchecking/linting

The guides are spellchecked and linted for markdown consistency. You can test your contributions by running `npm run lint::md`. Linting and spellchecking must pass or they will fail in Travis-CI. 

Markdown issues that will generate errors include:
- Lists and text must be left justified, otherwise the linter will generate indentation errors
- URL references must be followed by empty brackets `[]`.  See example below
- Unused URL reference definitions - comment them out if using them later
- Missing URL reference definitions

Most other markdown errors should be self explanatory.

URL reference and definition:
```markdown
This is a link to [something][]

[something]: https:\\www.something.com
```

Spellchecking uses a custom [ember-dictionary][] with words and terms common to the Ember community, such as `SemVer`. Words and terms that are associated with a specific guide can be placed in the `.local.dic` dictionary file. 

See the [ember-dictionary][] GitHub repo for specifics on using the local dictionary and adding words to the standard dictionary.

## Writing

Write once, edit twice (at least!) before opening a PR. When you edit your own writing, ask yourself:

* Am I using proper grammar and spelling?
* Can I clarify or simplify any of my explanations or examples?
* Have I included clear examples of everything I am documenting?
* Did I include links where appropriate?

You'll be amazed at how much better your writing gets as you edit and re-edit!

[ember-dictionary]: https://github.com/maxwondercorn/ember-dictionary
