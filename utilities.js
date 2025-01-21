// * Checks that the value isn't empty
export const isEmpty = (value) => {

  // * https://stackoverflow.com/questions/4597900/checking-something-isempty-in-javascript -- 03/06/2021 MF
  // * https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in -- 03/06/2021 MF

  return value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

  // * Returns true -- 03/06/2021 MF
  // console.log(componentName, getDateTime(), "isEmpty(\"\")", isEmpty(""));
  // console.log(componentName, getDateTime(), "isEmpty(null)", isEmpty(null));
  // console.log(componentName, getDateTime(), "isEmpty(undefined)", isEmpty(undefined));
  // console.log(componentName, getDateTime(), "isEmpty([])", isEmpty([]));
  // console.log(componentName, getDateTime(), "isEmpty({})", isEmpty({}));

  // * Returns false -- 03/06/2021 MF
  // console.log(componentName, getDateTime(), "isEmpty(\"test\")", isEmpty("test"));
  // console.log(componentName, getDateTime(), "isEmpty(5)", isEmpty(5));
  // console.log(componentName, getDateTime(), "isEmpty(true)", isEmpty(true));
  // console.log(componentName, getDateTime(), "isEmpty([\"test\"])", isEmpty(["test"]));
  // console.log(componentName, getDateTime(), "isEmpty({test: \"test\"})", isEmpty({ test: "test" }));
  
};


// * Converts the date to Month Date, Year format
export const convertDate = (dateToConvert) => {

  let convertedDate = new Date(dateToConvert).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return convertedDate;

};


// * Converts milliseconds to a Minute:Second format
export const millisecondsToMinutesAndSeconds = (milliseconds) => {

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // * Add leading zero if seconds is less than 10
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;

};