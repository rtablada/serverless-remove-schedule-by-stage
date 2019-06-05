# Serverless Remove Scheduled Events By Stage

This plugin helps manage stage deployment where you don't want to schedule events with serverless.

For instance if you have a `dev` stage where you only want to trigger events manually, it can be hard to make sure that this stage doesn't get scheduled (potentially breakind other stages or leading to dead dev code run on accident automatically).

## Installation

First install the plugin with `npm` or `yarn`:

```bash
npm install --dev serverless-remove-scheduled-events-by-stage
yarn add --dev serverless-remove-scheduled-events-by-stage
```

Next add the plugin to the plugins array and add config to `custom` in your `serverless.yml`:

```yml
plugins:
  - serverless-remove-scheduled-events-by-stage
custom:
  some-other-config: Hello World
  remove-schedule:
    stages:
      - dev
```

The stages array can be modified to any set of strings where you want to remove events with scheduled events.
If no `remove-schedule.stages` array is provided, this plugin defaults to removing scheduled events for the `dev` stage.

## Full Example `serverless.yml`

```yml
service: my-service
provider:
  name: aws
  runtime: nodejs8.10
plugins:
  - serverless-remove-scheduled-events-by-stage
custom:
  some-other-config: Hello World
  remove-schedule:
    stages:
      - dev
      - test

functions:
  hello:
    handler: handler.hello
    events:
      - schedule: cron(12 * * * ? *)
      - sns: dispatch
```

With this config in `production`, `staging`, etc the config will be left alone.
However in `dev` or `test` stages, the `events` for the function `hello` will only have an event for `sns` since the schedule event is removed!
All other events and configs will be left alone.

## License

This project is licensed under the [MIT License](./LICENSE).
