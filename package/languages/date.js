export const languages = {
  "fr-FR": {
    type: {
      year: { singular: "an", plural: "ans" },
      month: { singular: "mois", plural: "mois" },
      day: { singular: "jour", plural: "jours" },
      hour: { singular: "heure", plural: "heures" },
      minute: { singular: "minute", plural: "minutes" },
      second: { singular: "seconde", plural: "secondes" },
    },
    sentence: {
      ago: {
        singular: "il y a {gender} {time_type}",
        plural: "il y a {count} {time_type}",
      },
      in: {
        singular: "dans {gender} {time_type}",
        plural: "dans {count} {time_type}",
      },
    },
    gender: {
      feminine: "une",
      masculine: "un",
    },
  },
  "en-US": {
    type: {
      year: { singular: "year", plural: "years" },
      month: { singular: "month", plural: "months" },
      day: { singular: "day", plural: "days" },
      hour: { singular: "hour", plural: "hours" },
      minute: { singular: "minute", plural: "minutes" },
      second: { singular: "second", plural: "seconds" },
    },
    sentence: {
      ago: {
        singular: "{gender} {time_type} ago",
        plural: "{count} {time_type} ago",
      },
      in: {
        singular: "in {gender} {time_type}",
        plural: "in {count} {time_type}",
      },
    },
    gender: {
      feminine: "a",
      masculine: "a",
    },
  },
};

export const LanguagesAvailable = Object.keys(languages);
