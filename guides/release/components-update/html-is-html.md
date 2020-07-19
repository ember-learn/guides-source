The simplest way to use Ember is just HTML.

For example, MDN has a [letter example](https://github.com/mdn/learning-area/blob/master/html/introduction-to-html/marking-up-a-letter-finished/index.html) that it uses to teach beginning HTML.

If we just copy and paste the example into `application.hbs`, it will work without any changes.

```html {data-filename=app/templates/application.hbs}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br />
  Awesome Science faculty<br />
  University of Awesome<br />
  Bobtown, CA 99999,<br />
  USA<br />
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</address>

<p class="sender-column"><time datetime="2016-01-20">20 January 2016</time></p>

<address>
  <strong>Miss Eileen Dover</strong><br />
  4321 Cliff Top Edge<br />
  Dover, CT9 XXX<br />
  UK
</address>

<h1>Re: Eileen Dover university application</h1>

<p>Dear Eileen,</p>

<p>
  Thank you for your recent application to join us at the University of
  Awesome's science faculty to study as part of your
  <abbr title="Doctor of Philosophy">PhD</abbr> next year. I will answer your
  questions one by one, in the following sections.
</p>

<h2>Starting dates</h2>

<p>
  We are happy to accomodate you starting your study with us at any time,
  however it would suit us better if you could start at the beginning of a
  semester; the start dates for each one are as follows:
</p>

<ul>
  <li>First semester: <time datetime="2016-09-09">9 September 2016</time></li>
  <li>Second semester: <time datetime="2017-01-15">15 January 2017</time></li>
  <li>Third semester: <time datetime="2017-05-02">2 May 2017</time></li>
</ul>

<p>
  Please let me know if this is ok, and if so which start date you would prefer.
</p>

<p>
  You can find more information about
  <a
    href="http://www.example.com"
    title="table of awesome university important dates"
    >important university dates</a
  >
  on our website.
</p>

<h2>Subjects of study</h2>

<p>
  At the Awesome Science Faculty, we have a pretty open-minded research facility
  — as long as the subjects fall somewhere in the realm of science and
  technology. You seem like an intelligent, dedicated researcher, and just the
  kind of person we'd like to have on our team. Saying that, of the ideas you
  submitted we were most intrigued by are as follows, in order of priority:
</p>

<ol>
  <li>
    Turning H<sub>2</sub>O into wine, and the health benefits of Resveratrol
    (C<sub>14</sub>H<sub>12</sub>O<sub>3</sub>.)
  </li>
  <li>
    Measuring the effect on performance of funk bassplayers at temperatures
    exceeding 30°C (86°F), when the audience size exponentially increases
    (effect of 3 × 10<sup>3</sup> increasing to 3 × 10<sup>4</sup>.)
  </li>
  <li>
    <abbr title="HyperText Markup Language">HTML</abbr> and
    <abbr title="Cascading Style Sheets">CSS</abbr> constructs for representing
    musical scores.
  </li>
</ol>

<p>
  So please can you provide more information on each of these subjects,
  including how long you'd expect the research to take, required staff and other
  resources, and anything else you think we'd need to know? Thanks.
</p>

<h2>Exotic dance moves</h2>

<p>
  Yes, you are right! As part of my post-doctorate work, I <em>did</em> study
  exotic tribal dances. To answer your question, my favourite dances are as
  follows, with definitions:
</p>

<dl>
  <dt>Polynesian chicken dance</dt>
  <dd>
    A little known but <em>very</em> influential dance dating back as far as
    300<abbr title="Before Christ">BC</abbr>, a whole village would dance around
    in a circle like chickens, to encourage their livestock or be "fruitful".
  </dd>
  <dt>Icelandic brownian shuffle</dt>
  <dd>
    Before the Icelanders developed fire as a means of getting warm, they used
    to practice this dance, which involved huddling close together in a circle
    on the floor, and shuffling their bodies around in imperceptably tiny, very
    rapid movements. One of my fellow students used to say that he thought this
    dance inspired modern styles such as Twerking.
  </dd>
  <dt>Arctic robot dance</dt>
  <dd>
    An interesting example of historic misinformation, English explorers in the
    1960s believed to have discovered a new dance style characterised by
    "robotic", stilted movements, being practiced by inhabitants of Northern
    Alaska and Canada. Later on however it was discovered that they were just
    moving like this because they were really cold.
  </dd>
</dl>

<p>
  For more of my research, see my
  <a href="htp://www.example.com" title="Dr Gaye's exotic dance research"
    >exotic dance research page</a
  >.
</p>

<p>Yours sincerely,</p>

<p>Dr Eleanor Gaye</p>

<p>
  University of Awesome motto: <q>Be excellent to each other.</q> --
  <cite>The memoirs of Bill S Preston, <abbr title="Esquire">Esq</abbr></cite>
</p>
```

We can also take the CSS from the MDN example and put it into our application, and the letter will be styled correctly.

```css {data-filename=styles/app.css}
body {
  max-width: 800px;
  margin: 0 auto;
}

.sender-column {
  text-align: right;
}

h1 {
  font-size: 1.5em;
}

h2 {
  font-size: 1.3em;
}

p,
ul,
ol,
dl,
address {
  font-size: 1.1em;
}

p,
li,
dd,
dt,
address {
  line-height: 1.5;
}
```

You start building parts of an Ember application using HTML, so if you already know HTML and CSS, you know how to build a basic Ember application!

You can even use SVG or web components without any changes. As long as your HTML is valid, Ember will render it.

# Self-Closing Tags

In addition to normal HTML syntax, Ember allows you to use self-closing syntax (`<div />`) as a shorthand for an opening and closing tag (`<div></div>`).

You don't **need** to use this syntax for "void" HTML tags such as `img` or `br`, which are already defined as self-closing by the HTML spec, but you **can** use this syntax as a shorthand for tags that are not self-closing.

# Supported Features

This means that all of the following HTML features work as-is:

- Web components
- SVG
- HTML comments
- Whitespace has the same rules as normal HTML
- Special HTML elements like `<table>` and `<select>`

# Restrictions

There are a handful of restrictions on the HTML that you can put in an Ember template:

- Valid HTML only
- No `<script>` tags
- You can only use HTML that is valid in `<body>`

Other than that, go to town!
