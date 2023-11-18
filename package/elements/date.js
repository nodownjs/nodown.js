import { digitalDateRegExp } from "../config.js";
import { languages } from "../languages/date.js";

let language;

if (typeof window !== "undefined") {
  language = window.navigator.languages[1];
} else if (typeof process !== "undefined") {
  language = process.env.LANG.split(".")[0].replace(/_/, "-");
} else {
  language = "en-US";
}

const timeFormatMap = {
  t: "short-time",
  T: "long-time",
  d: "short-date",
  D: "long-date",
  f: "short-full",
  F: "long-full",
  r: "short-relative",
  R: "long-relative",
};

const dateFormatMap = {
  t: "timestamp",
  eu: "eureopean",
  e: "eureopean",
  us: "american",
  u: "american",
  iso: "iso",
  i: "iso",
};

function getTime(time) {
  const match =
    time
      .match(digitalDateRegExp)
      ?.slice(1)
      .map((d) => Math.round(d) || null) || [];

  const [d1, d2, d3, h, m, s] = match;
  return [d1, d2, d3, h, m, s];
}

export default function createDate(matches) {
  const obj = { type: "time" };
  const [type, time, format] = matches;

  obj.inFormat = dateFormatMap[type];
  obj.outFormat = timeFormatMap[format[0]];

  let year, month, day, hour, minute, second;

  switch (obj.inFormat) {
    case "timestamp":
      obj.timestamp = Math.floor(time * 1000);
      break;
    case "eureopean":
      getTime(time);
      [day, month, year, hour, minute, second] = getTime(time);
      break;
    case "american":
      [month, day, year, hour, minute, second] = getTime(time);
      break;
    case "iso":
      [year, month, day, hour, minute, second] = getTime(time);
      break;
  }
  if (obj.inFormat !== "timestamp") {
    month--;
    const d = new Date(year, month, day, hour, minute, second);
    obj.timestamp = d.getTime();
  }

  const date = new Date(obj.timestamp);

  let dateOptions = {};

  switch (obj.outFormat) {
    case "short-time":
      dateOptions.timeStyle = "short";
      break;
    case "long-time":
      dateOptions.timeStyle = "medium";
      break;
    case "short-date":
      dateOptions.dateStyle = "short";
      break;
    case "long-date":
      dateOptions.dateStyle = "long";
      break;
    case "short-full":
      dateOptions.dateStyle = "long";
      dateOptions.timeStyle = "short";
      break;
    case "long-full":
      dateOptions.weekday = "long";
      dateOptions.month = "long";
      dateOptions.day = "numeric";
      dateOptions.year = "numeric";
      dateOptions.hour = "numeric";
      dateOptions.minute = "numeric";

      break;
  }

  let text = "";

  if (obj.outFormat === "short-relative" || obj.outFormat === "long-relative") {
    const now = Math.floor(Date.now() / 1000);
    let durationTimestamp = now - obj.timestamp / 1000;

    const timeOptions = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    let future = durationTimestamp < 0;
    if (future) {
      durationTimestamp = -durationTimestamp;
    }

    let selectedTime = "";
    let duration = 0;

    for (const [timeTest, testTimestamp] of Object.entries(timeOptions)) {
      const difference = durationTimestamp / testTimestamp;
      if (difference >= 1) {
        duration = Math.round(durationTimestamp / testTimestamp);
        selectedTime = timeTest;
        break;
      }
    }

    if (!selectedTime) {
      selectedTime = "second";
      duration = 0;
    }

    let result = "";

    const relativeLanguage = languages[language].sentence;

    if (future) {
      result =
        duration <= 1
          ? relativeLanguage.in.singular
          : relativeLanguage.in.plural;
    } else {
      result =
        duration <= 1
          ? relativeLanguage.ago.singular
          : relativeLanguage.ago.plural;
    }

    if (duration <= 1) {
      const gender = ["hour", "minute", "second"].includes(selectedTime)
        ? languages[language].gender.feminine
        : languages[language].gender.masculine;
      if (obj.outFormat === "long-relative") {
        result = result.replace(/{gender}/, duration === 0 ? duration : gender);
        result = result.replace(
          /{time_type}/,
          languages[language].type[selectedTime].singular
        );
      } else if (obj.outFormat === "short-relative") {
        result = gender + " " + languages[language].type[selectedTime].singular;
      }
    } else {
      if (obj.outFormat === "long-relative") {
        result = result.replace(/{count}/, duration);
        result = result.replace(
          /{time_type}/,
          languages[language].type[selectedTime].plural
        );
      } else if (obj.outFormat === "short-relative") {
        result = duration + " " + languages[language].type[selectedTime].plural;
      }
    }
    text = result;
  } else {
    text = date.toLocaleString(language, dateOptions);
  }

  obj.children = [{ type: "text", children: text }];
  return obj;
}
