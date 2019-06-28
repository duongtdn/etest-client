"use strict"

export function formatDate(date) {
  const weekday  = ['Sunday', 'Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dd = date.getDate();
  const mm = ("00" + (date.getMonth()+1)).slice(-2); //January is 0!
  const yyyy = date.getFullYear();
  return `${weekday[date.getDay()]} ${dd}-${mm}-${yyyy}`
}
