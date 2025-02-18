export default {
  skipInvalidFields: true,
  components: {},
  contentTypes: {
    "article.article": {
      settings: {},
      fields: {
        name: {
          edit: {
            description: "The title of the article",
            someOtherValue: "someOtherValue",
          },
          list: {},
        },
        price: {
          someOtherValue: "someOtherValue",
          description: "The price of the article",
        },
      },
      layouts: {},
    },
    "bed.bed": {
      settings: {},
      fields: {
        name: {
          someOtherValue: "someOtherValue",
          description: "The title of the bed",
        },
        price: {
          someOtherValue: "someOtherValue",
          description: "The price of the bed",
        },
      },
    },
  },
};
