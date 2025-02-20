"use strict";

const Config = require("./config");

module.exports = {
  async bootstrap({ strapi }) {
    // Disable when dumping or restoring configuration, or executing any other command.
    if (!["start", "develop"].includes(process.argv?.[2])) {
      strapi.log.info("⚙️ [view-config]: Skipping setup.");
      return;
    }

    strapi.log.info("⚙️ [view-config]: Setting up config...");

    const config = new Config(strapi);
    await config.setup();

    strapi.log.info("⚙️ [view-config]: Finished config.");
  },
};
