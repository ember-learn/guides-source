// .remarkrc.js
/* eslint-env node */
const unified = require("unified");
const read = require("fs").readFileSync;
const ember = require("ember-dictionary");

exports.plugins = [
  [
    require("remark-retext"),
    unified().use({
      plugins: [
        [require("retext-contractions"), { straight: true }],
        require("retext-english"),
        require("retext-indefinite-article"),
        require("retext-repeated-words"),
        require("retext-syntax-urls"),
        [
          require("retext-spell"),
          {
            dictionary: ember,
            personal: read("./.local.dic")
          }
        ]
      ]
    })
  ],
  "remark-preset-lint-consistent",
  "remark-preset-lint-recommended",
  ["remark-lint-list-item-indent", "space"]
];
