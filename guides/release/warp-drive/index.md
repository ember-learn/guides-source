This section of the Guides describes the essential features of
[WarpDrive](https://warp-drive.io/guides/).
WarpDrive is the data library that new Ember apps include.
It builds requests, caches responses, and gives your app reactive records.

WarpDrive used to be called EmberData.
You will still see that name in older guides and addons.

Ember.js itself works with any type of back end: REST,
JSON:API, GraphQL, or anything else.
To learn about other ways to handle data, read the guide for
[making API requests](../in-depth-topics/making-api-requests/).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Coming from EmberData models? These guides teach WarpDrive schemas, which replace <code>Model</code> classes, adapters, and serializers. The <a href="https://warp-drive.io/guides/the-manual/misc/migrating/">WarpDrive migration guide</a> shows how to move an existing app step by step.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## What are records?

A record is an object that represents one piece of data that your app shows to the user.
For example, a photo sharing app might have `photo` records and `album` records.
An online shop might have `cart`, `invoice`, and `line-item` records.

Records are a different concept than the
[`model`](../routing/specifying-a-routes-model/) method on routes,
although the names are similar.
A route's `model` method often returns records, but it can return any value.

Records tend to be _persistent_.
The user expects the data to still be there when they come back to your app.
Most apps load records from a server and save changes back to it.

Each record has a **type** and an **ID**.
Together, the type and the ID identify one record.
For example, a contact app might have a record with the type `person` and the ID `1`.

## Schemas

A **schema** describes the fields of one type of record.
A schema is plain data. It contains no code.

```javascript {data-filename=app/schemas/person.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const PersonSchema = withDefaults({
  type: 'person',
  fields: [
    { kind: 'field', name: 'name' },
    { kind: 'field', name: 'birthday' },
  ],
});
```

Every record of the type `person` follows this schema.
You read its fields with dot notation, such as `person.name`.
The [Defining Schemas](./schemas/) guide shows all the field kinds.

## The Store and a Single Source of Truth

One common way to build web apps is to fetch data inside the components that show it.
For example, imagine you write the admin section of a blog.
It has a component that lists the drafts of the current user.

You might make the component fetch the drafts, store them, and show them:

```gjs {data-filename=app/components/list-of-drafts.gjs}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class ListOfDraftsComponent extends Component {
  @tracked drafts;

  constructor() {
    super(...arguments);

    fetch("/drafts").then((data) => {
      this.drafts = data;
    });
  }
  <template>
    <ul>
      {{#each this.drafts key="id" as |draft|}}
        <li>{{draft.title}}</li>
      {{/each}}
    </ul>
  </template>
}
```

This works for the `ListOfDrafts` component.
On another page, you may want a component that shows the number of drafts.
You might copy the `constructor` code into the new component:

```gjs {data-filename=app/components/drafts-button.gjs}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { LinkTo } from '@ember/routing';

export default class DraftsButtonComponent extends Component {
  @tracked drafts;

  constructor() {
    super(...arguments);

    fetch("/drafts").then((data) => {
      this.drafts = data;
    });
  }

  <template>
    <LinkTo @route="drafts">
      Drafts ({{this.drafts.length}})
    </LinkTo>
  </template>
}
```

Now the app makes two requests for the same data.
This wastes bandwidth and makes the app feel slower.
The two values can also get out of sync.
For example, the list can show three drafts while the button shows two.

The UI is also coupled to the network code.
If the URL or the shape of the JSON changes, you must find and fix every component that fetches it.

WarpDrive takes a different approach.
It gives your app a single **store**.
Routes and components ask the store for data.
The store knows how to fetch it and keeps one copy of each record.

When two components ask for the same record, they get the same object.
When the record changes, both components update.

### Injecting the store

New Ember apps include a `store` service in `app/services/store.js`:

```javascript {data-filename=app/services/store.js}
import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { JsonApiHandler } from 'my-app/handlers/json-api';
import { PersonSchema } from 'my-app/schemas/person';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: [JsonApiHandler],
  schemas: [PersonSchema],
});

export default Store;
```

The `useRecommendedStore` function creates a store class with the recommended defaults.
The `cache` option sets how the store caches responses.
`JSONAPICache` understands responses in the [JSON:API](https://jsonapi.org) format.
The `schemas` option lists the schemas of your app.
The `handlers` option lists your handlers.
The `JsonApiHandler` adds the JSON:API headers to every request, as shown in
[Request Handlers](./request-handlers/#toc_content-type).

To use the store, import the [`service` decorator](https://api.emberjs.com/ember/release/functions/@ember%2Fservice/service) and inject a `store` property into your class.
Here is an example in a route:

```javascript {data-filename=app/routes/people.js}
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import { getPeople } from "my-app/builders/person";

export default class PeopleRoute extends Route {
  @service store;

  async model() {
    const { content } = await this.store.request(getPeople());
    return content.data;
  }
}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You can read more about service injection in the <a href="../services/#toc_accessing-services"><i>Accessing Services</i></a> guide.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Requests and Builders

You ask the store for data with `store.request()`.
You pass it a request object.
A **builder** is a function that creates the request object for you.
Your app has one builder for each request that it makes:

```javascript {data-filename=app/builders/person.js}
import { findRecord } from '@warp-drive/utilities/json-api';

/** GET /people/:id */
export function getPerson(id) {
  return findRecord('person', id);
}
```

```javascript
import { getPerson } from 'my-app/builders/person';

const { content } = await this.store.request(getPerson('1'));
const person = content.data;
```

`findRecord` is a general builder from WarpDrive.
It creates a `GET` request for `/people/1`.
Your own builder gives the request a name, and keeps the details of your API in one place.
The [Finding Records](./finding-records/) guide shows how to write builders.

## Handlers

A **handler** is a function that runs for every request.
Handlers can change a request before it goes to the server.
They can also change the response before it goes into the cache.

For example, a handler can add an `Authorization` header to every request.
Another handler can convert a response from your API into JSON:API.

Handlers replace the adapters and serializers of older EmberData versions.
The [Request Handlers](./request-handlers/) and
[Normalizing Responses](./normalizing-responses/) guides show how to write them.

## Caching

The store caches the response to each request.
If you ask for the same data again, the store can answer from the cache.
This means fewer requests to the server and a faster UI.

The store also keeps one record object for each type and ID.
If two requests return the person with ID `1`, both responses use the same object.
A change to that record shows everywhere in your UI.

By default, the store uses the `Cache-Control` and `Expires` headers of a response
to decide when cached data is stale.
If a response has neither header, the store reloads the data in the background after 30 seconds.
After 15 minutes, it waits for a new response.
To learn more, read the [WarpDrive caching guide](https://warp-drive.io/guides/the-manual/caching/).

## Records Are Immutable

Records that come from the server are immutable.
You cannot set their fields directly.
This keeps each record equal to the data on the server.

To change a record, you check out an editable copy.
You edit the copy, and then save the change with a request.
When the server accepts the change, the cache updates the record.
The [Creating, Updating and Deleting](./creating-updating-and-deleting-records/) guide shows each step.

---

Schemas, records, the store, requests, and handlers are the core concepts of WarpDrive.
The next guides go into more depth about each of them.
