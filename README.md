# strapi-plugin-view-config

## Overview

[![NPM Version](https://img.shields.io/npm/v/@bookthat-group/strapi-plugin-view-config)](https://www.npmjs.com/package/@bookthat-group/strapi-plugin-view-config)

**Note:** This plugin overwrites user settings on each build. Any manual modifications in the Strapi admin panel will be reset when the application is restarted.

`strapi-plugin-view-config` is a Strapi plugin designed to manage and extend content manager view configurations through a configuration file. This plugin allows developers to customize the view settings of their content types and components, enhancing the user experience in the Strapi admin panel.

## Features

- **Dynamic Configuration**: Easily manage view settings for content types and components using a configuration file.
- **Skip Invalid Fields**: Option to skip non-existing fields during configuration setup.
- **Customizable Descriptions**: Add descriptions and other metadata to views for better clarity in the admin interface.

## Installation

To install the `strapi-plugin-view-config`, follow these steps:

1. Navigate to your Strapi project directory.
2. Install the plugin using npm or yarn:

   ```bash
   npm install @bookthat-group/strapi-plugin-view-config
   ```

   or

   ```bash
   yarn add @bookthat-group/strapi-plugin-view-config
   ```

3. Add the plugin to your `./config/plugins.js` file:

   ```javascript
   module.exports = {
     // other plugins
     "view-config": {
       enabled: true,
       config: {
         skipInvalidFields: false, // Disable import of non-valid fields (based on Strapi fields)
       },
     },
   };
   ```

4. Create a configuration file at `./config/view-config.js` or `./config/view-config.ts` based on your preference.

## Configuration

The configuration file should export an object that defines the structure of view settings. This follows Strapi’s core admin configuration. For reference, see the [Strapi core admin configuration](https://github.com/strapi/strapi/blob/fdac61dd05ca665168f51f655f1d165b55ec4231/packages/core/admin/admin/src/types/adminConfiguration.ts#L17).

**Note:** This file contains all possible options, but the plugin currently only supports `fields: edit & list`. Future updates will extend support for additional settings.

```javascript
"use strict";

module.exports = {
  // Component views
  components: {},
  // API views
  contentTypes: {
    "article.article": {
      settings: {
        // "bulkable": true,
        // "filterable": true,
        // "searchable": true,
        // "pageSize": 10,
        // "mainField": "name",
        // "defaultSortBy": "name",
        // "defaultSortOrder": "ASC"
      },
      fields: {
        name: {
          edit: {
            description: "The name of the article",
          },
          list: {
            // label: "name",
            // searchable: true,
            // sortable: true,
          },
        },
        price: {
          edit: {
            description: "The price of the article",
          },
        },
      },
      layouts: {
        // edit: [
        //   { name: "name", size: 6 },
        //   { name: "price", size: 4 },
        // ],
      },
    },
  },
};
```

## Usage

Once the plugin is installed and configured, it will automatically set up the view configurations when you start or develop your Strapi application.

1. Start your Strapi application:

   ```bash
   npm run develop
   ```

2. The plugin will log the setup process in the console.

## Contributing

Contributions are welcome! To contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please reach out to [development@bookthat.nl](mailto:development@bookthat.nl).

## WIP

- Extend the plugin to support more configurations (e.g., layout, settings).
