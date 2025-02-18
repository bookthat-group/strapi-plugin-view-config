'use strict';

const Config = require('./config');

module.exports = {
  async bootstrap({ strapi }) {
    strapi.log.info('Setting view config...');

    // Disable when dumping or restoring configuration, or executing any other command.
    if (!['start', 'develop'].includes(process.argv?.[2])) {
      return;
    }

    const config = new Config(strapi);
    config.setup();

    strapi.log.info('Finished view config.');
  }
};
