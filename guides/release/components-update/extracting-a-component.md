You can put all of your application HTML into a single file, but in practice, you'll probably want to break it apart into smaller files.

In Ember, you break your application into smaller pieces called "components".

Let's start with MDN's [letter example](https://github.com/mdn/learning-area/blob/master/html/introduction-to-html/marking-up-a-letter-finished/index.html) that it uses to teach beginning HTML.

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

```

## Breaking it into pieces

Let's take the large template and break it up into smaller pieces:

- The letter itself
  - Sender's address
  - Receiver's address
  - Starting dates
  - Subjects
  - Dance Moves
  - Signature

### The Sender's Address

First, let's copy the sender's address into its own component.

```handlebars {app/components/sender-address.hbs}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br>
  Awesome Science faculty<br>
  University of Awesome<br>
  Bobtown, CA 99999,<br>
  USA<br>
  <strong>Tel</strong>: 123-456-7890<br>
  <strong>Email</strong>: no_reply@example.com
</address>
```

We've just created our first component! A component is kind of like your own custom HTML tag.

HTML tags start with lowercase letters (`<div>`, `<p>`, `<table>`), and Ember components start with capital letters. Our component is called `<SenderAddress>`, based on its name on the file system.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        A component's name is the same as its name on the file system, capitalizing the first letter and every letter following a `-`, and removing the `-` ("pascal case").
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

We can include it into our application using HTML tag syntax.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-1,-2,-3,-4,-5,-6,-7,-8,-9,+10"}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br />
  Awesome Science faculty<br />
  University of Awesome<br />
  Bobtown, CA 99999,<br />
  USA<br />
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</address>
<SenderAddress />

<p class="sender-column"><time datetime="2016-01-20">20 January 2016</time></p>

<address>
  <strong>Miss Eileen Dover</strong><br />
  4321 Cliff Top Edge<br />
  Dover, CT9 XXX<br />
  UK
</address>

<h1>Re: Eileen Dover university application</h1>

...
```

### The Receiver's Address

Let's do it again. Pull out the receiver's address, and then include it in our application.

```handlebars {data-filename="app/components/receiver-address.hbs"}
<address>
  <strong>Miss Eileen Dover</strong><br>
  4321 Cliff Top Edge<br>
  Dover, CT9 XXX<br>
  UK
</address>
```

```handlebars {data-filename="app/templates/application.hbs" data-diff="-5,-6,-7,-8,-9,-10,+11"}
<SenderAddress />

<p class="sender-column"><time datetime="2016-01-20">20 January 2016</time></p>

<address>
  <strong>Miss Eileen Dover</strong><br />
  4321 Cliff Top Edge<br />
  Dover, CT9 XXX<br />
  UK
</address>
<ReceiverAddress />

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

...
```

### Keep on Extracting

Let's keep going. Pull out starting dates into its own component.

```handlebars {data-filename="app/components/starting-dates.hbs"}
<h2>Starting dates</h2>

<p>We are happy to accomodate you starting your study with us at any time, however it would suit us better if you could
  start at the beginning of a semester; the start dates for each one are as follows:</p>

<ul>
  <li>First semester: <time datetime="2016-09-09">9 September 2016</time></li>
  <li>Second semester: <time datetime="2017-01-15">15 January 2017</time></li>
  <li>Third semester: <time datetime="2017-05-02">2 May 2017</time></li>
</ul>

<p>Please let me know if this is ok, and if so which start date you would prefer.</p>

<p>You can find more information about <a href="http://www.example.com"
    title="table of awesome university important dates">important university dates</a> on our website.</p>
```

And include it in the application.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,+33"}
<SenderAddress />

<p class="sender-column"><time datetime="2016-01-20">20 January 2016</time></p>

<ReceiverAddress />

<h1>Re: Eileen Dover university application</h1>

<p>Dear Eileen,</p>

<p>
  Thank you for your recent application to join us at the University of
  Awesome's science faculty to study as part of your
  <abbr title="Doctor of Philosophy">PhD</abbr> next year. I will answer your
  questions one by one, in the following sections.
</p>

<h2>Starting dates</h2>

<p>We are happy to accomodate you starting your study with us at any time, however it would suit us better if you could
  start at the beginning of a semester; the start dates for each one are as follows:</p>

<ul>
  <li>First semester: <time datetime="2016-09-09">9 September 2016</time></li>
  <li>Second semester: <time datetime="2017-01-15">15 January 2017</time></li>
  <li>Third semester: <time datetime="2017-05-02">2 May 2017</time></li>
</ul>

<p>Please let me know if this is ok, and if so which start date you would prefer.</p>

<p>You can find more information about <a href="http://www.example.com"
    title="table of awesome university important dates">important university dates</a> on our website.</p>
<StartingDates />

<h2>Subjects of study</h2>

<p>At the Awesome Science Faculty, we have a pretty open-minded research facility — as long as the subjects fall
  somewhere in the realm of science and technology. You seem like an intelligent, dedicated researcher, and just the
  kind of person we'd like to have on our team. Saying that, of the ideas you submitted we were most intrigued by are as
  follows, in order of priority:</p>

<ol>
  <li>Turning H<sub>2</sub>O into wine, and the health benefits of Resveratrol
    (C<sub>14</sub>H<sub>12</sub>O<sub>3</sub>.)</li>
  <li>Measuring the effect on performance of funk bassplayers at temperatures exceeding 30°C (86°F), when the audience
    size exponentially increases (effect of 3 × 10<sup>3</sup> increasing to 3 × 10<sup>4</sup>.)</li>
  <li><abbr title="HyperText Markup Language">HTML</abbr> and <abbr title="Cascading Style Sheets">CSS</abbr> constructs
    for representing musical scores.</li>
</ol>

...
```

Extract subjects of study.

```handlebars {data-filename="app/components/subjects.hbs"}
<h2>Subjects of study</h2>

<p>At the Awesome Science Faculty, we have a pretty open-minded research facility — as long as the subjects fall
  somewhere in the realm of science and technology. You seem like an intelligent, dedicated researcher, and just the
  kind of person we'd like to have on our team. Saying that, of the ideas you submitted we were most intrigued by are as
  follows, in order of priority:</p>

<ol>
  <li>Turning H<sub>2</sub>O into wine, and the health benefits of Resveratrol
    (C<sub>14</sub>H<sub>12</sub>O<sub>3</sub>.)</li>
  <li>Measuring the effect on performance of funk bassplayers at temperatures exceeding 30°C (86°F), when the audience
    size exponentially increases (effect of 3 × 10<sup>3</sup> increasing to 3 × 10<sup>4</sup>.)</li>
  <li><abbr title="HyperText Markup Language">HTML</abbr> and <abbr title="Cascading Style Sheets">CSS</abbr> constructs
    for representing musical scores.</li>
</ol>

<p>So please can you provide more information on each of these subjects, including how long you'd expect the research to
  take, required staff and other resources, and anything else you think we'd need to know? Thanks.</p>
```

Include it in the application.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,+35"}
<SenderAddress />

<p class="sender-column"><time datetime="2016-01-20">20 January 2016</time></p>

<ReceiverAddress />

<h1>Re: Eileen Dover university application</h1>

<p>Dear Eileen,</p>

<p>
  Thank you for your recent application to join us at the University of
  Awesome's science faculty to study as part of your
  <abbr title="Doctor of Philosophy">PhD</abbr> next year. I will answer your
  questions one by one, in the following sections.
</p>

<StartingDates />

<h2>Subjects of study</h2>

<p>At the Awesome Science Faculty, we have a pretty open-minded research facility — as long as the subjects fall
  somewhere in the realm of science and technology. You seem like an intelligent, dedicated researcher, and just the
  kind of person we'd like to have on our team. Saying that, of the ideas you submitted we were most intrigued by are as
  follows, in order of priority:</p>

<ol>
  <li>Turning H<sub>2</sub>O into wine, and the health benefits of Resveratrol
    (C<sub>14</sub>H<sub>12</sub>O<sub>3</sub>.)</li>
  <li>Measuring the effect on performance of funk bassplayers at temperatures exceeding 30°C (86°F), when the audience
    size exponentially increases (effect of 3 × 10<sup>3</sup> increasing to 3 × 10<sup>4</sup>.)</li>
  <li><abbr title="HyperText Markup Language">HTML</abbr> and <abbr title="Cascading Style Sheets">CSS</abbr> constructs
    for representing musical scores.</li>
</ol>
<Subjects />

<h2>TODO</h2>

<p>TODO</p>
...
```

And exotic dance moves.

```handlebars {data-filename="app/components/dance-moves.hbs"}
<h2>Exotic dance moves</h2>

<p>TODO</p>
```

Include it in the application.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,-37,-38,-39,-40,-41,-42,+43"}
<SenderAddress />

<p class="sender-column"><time datetime="2016-01-20">20 January 2016</time></p>

<ReceiverAddress />

<h1>Re: Eileen Dover university application</h1>

<p>Dear Eileen,</p>

<p>
  Thank you for your recent application to join us at the University of
  Awesome's science faculty to study as part of your
  <abbr title="Doctor of Philosophy">PhD</abbr> next year. I will answer your
  questions one by one, in the following sections.
</p>

<StartingDates />
<Subjects />

<h2>TODO</h2>

<p>TODO</p>
...
```

And finally, the signature.

```handlebars {data-filename="app/components/signature.hbs"}
<p>Yours sincerely,</p>

<p>Dr Eleanor Gaye</p>


<p>University of Awesome motto: <q>Be excellent to each other.</q> -- <cite>The memoirs of Bill S Preston, <abbr
      title="Esquire">Esq</abbr></cite></p>
```

```handlebars {data-filename="app/templates/application.hbs" data-diff="-7,-8,-9,-10,-11,-12,+13"}
...

<StartingDates />
<Subjects />
<ToDo>

<p>Yours sincerely,</p>

<p>Dr Eleanor Gaye</p>

<p>University of Awesome motto: <q>Be excellent to each other.</q> -- <cite>The memoirs of Bill S Preston, <abbr
      title="Esquire">Esq</abbr></cite></p>
<Signature />
```
