export function isValidSettings(settings) {
  if (!settings || settings.length === 0) {
    return false;
  }
  return settings.every(
    (setting) =>
      setting.min <= setting.max &&
      setting.min <= setting.days.filter((day) => day).length
  );
}
