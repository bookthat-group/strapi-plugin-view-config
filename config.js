"use strict";

const fs = require("fs").promises;
const _ = require("lodash");

class Config {
  async setup() {
    if (!strapi.isLoaded) {
      setTimeout(() => {
        this.setup();
      }, 200);
      return;
    }

    const pluginConfig = strapi.config.get("plugin.view-config");
    const skipInvalidFields =
      strapi.plugin("view-config").config("skipInvalidFields") ?? true;
    const tasks = [];

    if (!strapi.config["view-config"]) {
      strapi.log.info("[Permissions] ⚙️ Creating view-config file...");
      await this.createConfigFile(pluginConfig.typescript);

      // Strapi is now auto restarting... if not, schedule a 'kill'
      setTimeout(() => {
        strapi.log.info(
          `⚙️ [view-config]: Created config/view-config.${
            pluginConfig.typescript ? "ts" : "js"
          }. Please restart Strapi manually.`
        );
        process.exit(1);
      }, 200);
    }

    strapi.log.info(
      `⚙️ [view-config]: Skip invalid fields is ${
        skipInvalidFields
          ? "enabled – non-existing fields will be skipped."
          : "disabled – all fields will be added, even if they don't exist in Strapi."
      }`
    );

    if (strapi.config["view-config"].components) {
      tasks.push(
        (async () => {
          await this.handleConfig(
            strapi.config["view-config"].components,
            "components::",
            skipInvalidFields
          );
          strapi.log.info(
            "⚙️ [view-config]: All component views have been successfully configured."
          );
        })()
      );
    }

    if (strapi.config["view-config"].contentTypes) {
      tasks.push(
        (async () => {
          await this.handleConfig(
            strapi.config["view-config"].contentTypes,
            "content_types::api::",
            skipInvalidFields
          );
          strapi.log.info(
            "⚙️ [view-config]: All content type views have been successfully configured."
          );
        })()
      );
    }

    await Promise.all(tasks);
    strapi.log.info(
      "⚙️ [view-config]: All views have been successfully configured."
    );
  }

  async handleConfig(config, keyPrefix, skipInvalidFields) {
    const store = strapi.store({
      type: "plugin",
      name: "content_manager_configuration",
    });

    if (typeof config !== "object" || !keyPrefix) {
      strapi.log.error(
        "❌ [view-config]: Invalid input provided to handleConfig."
      );
      return;
    }

    for (const key of Object.keys(config)) {
      try {
        const existingConfig = await store.get({ key: `${keyPrefix}${key}` });

        // Skip if no store. If no store, it means that the content type does not exist.
        if (!existingConfig) {
          strapi.log.warn(
            `⚠️ [view-config]: No store found for "${key}". Skipping.`
          );
          continue;
        }

        // get fields from the config
        const { fields } = config[key];

        if (typeof fields !== "object") {
          strapi.log.warn(
            `⚠️ [view-config]: No valid fields found for "${key}". Skipping.`
          );
          continue;
        }

        let updated = false;
        const originalConfig = _.cloneDeep(existingConfig); // Clone before modification

        for (const [fieldName, fieldData] of Object.entries(fields)) {
          const existingField = existingConfig.metadatas?.[fieldName];

          // Skip if field does not exist
          if (!existingField) {
            strapi.log.warn(
              `⚠️ [view-config]: Field "${fieldName}" does not exist on "${key}". Skipping.`
            );
            continue;
          }

          for (const section of ["edit", "list"]) {
            if (fieldData[section]) {
              const validData = Object.entries(fieldData[section]).reduce(
                (valid, [key, value]) => {
                  if (
                    !skipInvalidFields ||
                    Object.hasOwn(existingField[section], key)
                  ) {
                    _.merge(valid, { [key]: value });
                  }
                  return valid;
                },
                {}
              );

              if (Object.keys(validData).length) {
                if (existingField[section]) {
                  _.merge(existingField[section], validData);
                  updated = true;
                } else {
                  strapi.log.warn(
                    `⚠️ [view-config]: "${section}" section not found for "${key}".`
                  );
                }
              }
            }
          }
        }

        if (updated) {
          const mergedConfig = {
            key: `${keyPrefix}${key}`,
            value: existingConfig,
          };

          // Only update if the config has changed
          if (!_.isEqual(originalConfig, mergedConfig.value)) {
            await store.set(mergedConfig);
          }
        }
      } catch (error) {
        strapi.log.error(
          `❌ [view-config]: Error processing config for "${key}": ${error.message}`
        );
      }
    }
  }

  async createConfigFile(typescript = false) {
    const targetFilename = `${
      strapi.dirs.config || strapi.dirs.app.config
    }/view-config.${typescript ? "ts" : "js"}`;

    try {
      await fs.stat(targetFilename);
    } catch (e) {
      if (e.code !== "ENOENT") {
        return;
      }

      await fs.copyFile(
        `${__dirname}/default-view-config.${typescript ? "ts" : "js"}`,
        targetFilename
      );
    }
  }
}

module.exports = Config;
