A schema can describe how its records relate to records of other types.
WarpDrive has two relationship fields:

- `belongsTo` links a record to one other record.
- `hasMany` links a record to a list of other records.

A relationship field has a `type`, which is the type of the related records.
It also has `options`.
In current WarpDrive schemas, every relationship uses these options:

- `async: false` means that the related records come with the parent record. You read them without a promise.
- `inverse` is the name of the matching field on the related type, or `null` if there is none.
- `linksMode: true` tells WarpDrive to load the relationship with the same requests as everything else.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Relationship support in WarpDrive schemas is still growing. The <a href="https://warp-drive.io/guides/the-manual/misc/links-mode">LinksMode guide</a> on warp-drive.io describes what works today and what comes next.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### One-to-One

To declare a one-to-one relationship between two types, use
`belongsTo` on both sides:

```javascript {data-filename=app/schemas/user.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const UserSchema = withDefaults({
  type: 'user',
  fields: [
    { kind: 'field', name: 'name' },
    {
      kind: 'belongsTo',
      name: 'profile',
      type: 'profile',
      options: { async: false, inverse: 'user', linksMode: true },
    },
  ],
});
```

```javascript {data-filename=app/schemas/profile.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const ProfileSchema = withDefaults({
  type: 'profile',
  fields: [
    { kind: 'field', name: 'bio' },
    {
      kind: 'belongsTo',
      name: 'user',
      type: 'user',
      options: { async: false, inverse: 'profile', linksMode: true },
    },
  ],
});
```

Each `inverse` names the field on the other side.
Because of this, WarpDrive keeps both sides in sync.
When `user.profile` points to a profile, that profile's `user` points back to the user.

### One-to-Many

To declare a one-to-many relationship, use `belongsTo` on one side and
`hasMany` on the other side:

```javascript {data-filename=app/schemas/blog-post.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const BlogPostSchema = withDefaults({
  type: 'blog-post',
  fields: [
    { kind: 'field', name: 'title' },
    {
      kind: 'hasMany',
      name: 'comments',
      type: 'comment',
      options: { async: false, inverse: 'blogPost', linksMode: true },
    },
  ],
});
```

```javascript {data-filename=app/schemas/comment.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const CommentSchema = withDefaults({
  type: 'comment',
  fields: [
    { kind: 'field', name: 'body' },
    {
      kind: 'belongsTo',
      name: 'blogPost',
      type: 'blog-post',
      options: { async: false, inverse: 'comments', linksMode: true },
    },
  ],
});
```

### Many-to-Many

To declare a many-to-many relationship, use `hasMany` on both sides:

```javascript {data-filename=app/schemas/blog-post.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const BlogPostSchema = withDefaults({
  type: 'blog-post',
  fields: [
    { kind: 'field', name: 'title' },
    {
      kind: 'hasMany',
      name: 'tags',
      type: 'tag',
      options: { async: false, inverse: 'blogPosts', linksMode: true },
    },
  ],
});
```

```javascript {data-filename=app/schemas/tag.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const TagSchema = withDefaults({
  type: 'tag',
  fields: [
    { kind: 'field', name: 'name' },
    {
      kind: 'hasMany',
      name: 'blogPosts',
      type: 'blog-post',
      options: { async: false, inverse: 'tags', linksMode: true },
    },
  ],
});
```

### Relationships Without an Inverse

Sometimes only one side needs to know about the other.
For example, a comment has an author, but you never list the comments of a user.
Set `inverse` to `null`:

```javascript {data-filename=app/schemas/comment.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const CommentSchema = withDefaults({
  type: 'comment',
  fields: [
    { kind: 'field', name: 'body' },
    {
      kind: 'belongsTo',
      name: 'author',
      type: 'user',
      options: { async: false, inverse: null, linksMode: true },
    },
  ],
});
```

A relationship without an inverse is also useful for large lists.
For example, a user can have thousands of activities.
If the relationship has no inverse, each activity you load does not change the list on the user.

### Reflexive Relations

A record can relate to other records of the same type.
For example, a folder can have a parent folder and child folders:

```javascript {data-filename=app/schemas/folder.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const FolderSchema = withDefaults({
  type: 'folder',
  fields: [
    { kind: 'field', name: 'name' },
    {
      kind: 'belongsTo',
      name: 'parent',
      type: 'folder',
      options: { async: false, inverse: 'children', linksMode: true },
    },
    {
      kind: 'hasMany',
      name: 'children',
      type: 'folder',
      options: { async: false, inverse: 'parent', linksMode: true },
    },
  ],
});
```

### Polymorphism

A polymorphic relationship can point to records of more than one type.
For example, a user can have pets that are cats or dogs.
Add `polymorphic: true` to the options of the field that holds the different types.
On each concrete type, add `as` with the name of the shared abstract type.

```javascript {data-filename=app/schemas/user.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const UserSchema = withDefaults({
  type: 'user',
  fields: [
    {
      kind: 'hasMany',
      name: 'pets',
      type: 'pet',
      options: {
        async: false,
        inverse: 'owner',
        polymorphic: true,
        linksMode: true,
      },
    },
  ],
});
```

```javascript {data-filename=app/schemas/cat.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const CatSchema = withDefaults({
  type: 'cat',
  fields: [
    { kind: 'field', name: 'name' },
    {
      kind: 'belongsTo',
      name: 'owner',
      type: 'user',
      options: { async: false, inverse: 'pets', as: 'pet', linksMode: true },
    },
  ],
});
```

A `dog` schema has the same `owner` field.
The server sends the real type of each pet, such as `cat` or `dog`.
To learn more, read [Polymorphism](https://warp-drive.io/guides/the-manual/relational-data/features/polymorphism) in the WarpDrive guides.

### Relationship Data from the Server

The server sends relationships in the `relationships` member of a JSON:API resource.
For a relationship in links mode, the payload needs one of these:

- a `links.related` URL that WarpDrive can use to load the relationship, or
- the related records in the `included` member of the same response.

Here is a blog post response with its comments included:

```json
{
  "data": {
    "type": "blog-post",
    "id": "1",
    "attributes": { "title": "Rails is Omakase" },
    "relationships": {
      "comments": {
        "links": { "related": "/blog-posts/1/comments" },
        "data": [{ "type": "comment", "id": "1" }]
      }
    }
  },
  "included": [
    {
      "type": "comment",
      "id": "1",
      "attributes": { "body": "Nice post!" },
      "relationships": {
        "blogPost": { "data": { "type": "blog-post", "id": "1" } }
      }
    }
  ]
}
```

An empty relationship is valid too.
Use `"data": null` for an empty `belongsTo` and `"data": []` for an empty `hasMany`.
A relationship with no `data` member and no related link is not valid.
WarpDrive cannot tell if the relationship is empty or if the server left it out.

If your API does not send related links, a [handler](../normalizing-responses/) can add them to the response.

### Retrieving Related Records

Relationships with `async: false` are not promises.
You read them like any other field:

```javascript
let comment = this.store.peekRecord('comment', '1');
let post = comment.blogPost; // => a blog-post record

let comments = post.comments; // => an array of comment records
comments.length; // => 1
```

In a template, you can loop over a `hasMany` directly:

```gjs {data-filename=app/templates/blog-post.gjs}
<template>
  <ul>
    {{#each @model.comments as |comment|}}
      <li>{{comment.body}}</li>
    {{/each}}
  </ul>
</template>
```

To load the related records with the parent record, use the `include` option in your builder:

```javascript {data-filename=app/builders/blog-post.js}
import { findRecord } from '@warp-drive/utilities/json-api';

/** GET /blog-posts/:id?include=comments */
export function getBlogPostWithComments(id) {
  return findRecord('blog-post', id, { include: ['comments'] });
}
```

```javascript
import { getBlogPostWithComments } from 'my-app/builders/blog-post';

const { content } = await this.store.request(getBlogPostWithComments('1'));
const post = content.data;
```

To load a `hasMany` again from its related link, call `reload()` on it:

```javascript
await post.comments.reload(); // => GET /blog-posts/1/comments
```

The links of a `hasMany` are available as `post.comments.links`.

### Creating Records with Relationships

To create a record that relates to another record, put the relationship in the body of the request.
This builder creates a comment for a blog post:

```javascript {data-filename=app/builders/comment.js}
import { buildBaseURL } from '@warp-drive/utilities';

/** POST /comments */
export function createComment(post, attributes) {
  return {
    url: buildBaseURL({ resourcePath: 'comments' }),
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: 'comment',
        attributes,
        relationships: {
          blogPost: { data: { type: 'blog-post', id: post.id } },
        },
      },
    }),
    op: 'createRecord',
    cacheOptions: { types: ['comment'] },
  };
}
```

```javascript
import { createComment } from 'my-app/builders/comment';

const { content } = await this.store.request(
  createComment(post, { body: 'Nice post!' }),
);
const comment = content.data;
```

The server responds with the saved comment and its `blogPost` relationship.
Because the relationship has an inverse, `post.comments` then includes the new comment.

The [Creating, Updating and Deleting](../creating-updating-and-deleting-records/#toc_creating-records) guide explains the parts of the builder.

### Readonly Nested Data

Sometimes the server sends nested data that is not its own record type, such as a location or a list of tags.
You do not need a relationship for this.
Store the data in a normal field, as shown in
[Defining Schemas](../schemas/#toc_read-only-nested-data).
