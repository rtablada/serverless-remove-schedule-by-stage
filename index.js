const _ = require('lodash');

class RemoveScheduledEventsPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.awsProvider = this.serverless.getProvider('aws');
    this.stage = this.options.stage;
    this.allowedStages = _.get(this, 'serverless.service.custom.remove-schedule.stages') || ['dev'];

    this.hooks = {
      'before:package:setupProviderConfiguration': this.removeScheduledFunctions.bind(this),
    };
  }

  removeScheduledFunctions() {
    if (this.allowedStages.indexOf(this.stage) !== -1) {
      let { functions } = this.serverless.service;
      this.serverless.cli.log(`Removing scheduled events from functions in stage: ${this.stage}`);

      this.serverless.service.functions = _.mapValues(functions, (fn) => {
        return Object.assign(fn, {
          events: fn.events.map((ev) => {
            let newEv = _.cloneDeep(ev);

            if (newEv.schedule !== undefined) {
              delete newEv.schedule
            }

            return newEv
          })
        })
      });
    }
  }
}

module.exports = RemoveScheduledEventsPlugin;
