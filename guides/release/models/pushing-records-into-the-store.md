The store is a cache of all the records that your app has loaded.
Usually, records get into the cache as the response to a request.
You can also push records into the cache yourself.

This is useful if you know which records the user will need next.
When the user clicks a link, Ember can render the new page without waiting for the network.

Pushing records is also useful if your app has a streaming connection to the server, such as a WebSocket.
When the server tells you that a record changed, you push the new data.
Every part of the UI that shows the record updates.

### Pushing Records

To push records into the store, call `store.push()` with a JSON:API document.

For example, imagine we want to put some data into the store when the app boots.
We can use the application route to do so.
The application route is the top-most route, and its `model` hook runs once when the app starts.

```javascript {data-filename=app/schemas/album.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const AlbumSchema = withDefaults({
  type: 'album',
  fields: [
    { kind: 'field', name: 'title' },
    { kind: 'field', name: 'artist' },
    { kind: 'field', name: 'songCount' },
  ],
});
```

```javascript {data-filename=app/routes/application.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  model() {
    this.store.push({
      data: [
        {
          id: '1',
          type: 'album',
          attributes: {
            title: 'Fewer Moving Parts',
            artist: 'David Bazan',
            songCount: 10,
          },
        },
        {
          id: '2',
          type: 'album',
          attributes: {
            title: "Calgary b/w I Can't Make You Love Me/Nick Of Time",
            artist: 'Bon Iver',
            songCount: 2,
          },
        },
      ],
    });
  }
}
```

`push()` returns the records that it created or updated.
Later, `this.store.peekRecord('album', '1')` returns the same record without a request.

The document must already be in the shape that the cache expects.
The `type` must match the `type` of a schema.
The attribute names must match the field names, or the `sourceKey` of a field.

`push()` adds new records and updates existing ones.
Fields that are not in the document keep their current values.

### Data in a Different Format

`push()` does not convert data from other formats.
If your server sends a different format, convert it before you push it.
If the data comes from a request, a [handler](../customizing-serializers/) is the best place for that conversion.

### Endpoints That Change Many Records

Sometimes an endpoint runs some business logic and then changes several records.
For example, a payment endpoint can create an order and update the inventory.

You do not need to push the response yourself.
Write a builder for the endpoint and send it with `store.request()`.
If the response is a JSON:API document, the store puts every record in it into the cache:

```javascript {data-filename=app/builders/confirm-payment.js}
export function confirmPayment(data) {
  return {
    url: '/api/process-payment',
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/vnd.api+json' }),
    body: JSON.stringify(data),
  };
}
```

```javascript {data-filename=app/routes/confirm-payment.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { confirmPayment } from 'my-app/builders/confirm-payment';

export default class ConfirmPaymentRoute extends Route {
  @service store;
  @service router;

  confirm = async (data) => {
    await this.store.request(confirmPayment(data));
    this.router.transitionTo('thank-you');
  };
}
```

The rest of your app sees the new and changed records right away.

### Real-time Updates

To learn more about pushing updates from a WebSocket or other stream, read
the [real-time guide](https://warp-drive.io/guides/the-manual/realtime/) of WarpDrive.
