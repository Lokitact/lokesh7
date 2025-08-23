export function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();

  // --- Years, months, days ---
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // --- Next birthday ---
  let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const diffToNext = nextBirthday - today;
  const nbMonths = (nextBirthday.getFullYear() - today.getFullYear()) * 12 +
                   nextBirthday.getMonth() - today.getMonth();
  const nbDays = Math.floor(diffToNext / (1000 * 60 * 60 * 24));

  // --- Extra calculations ---
  const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;
  const totalMilliseconds = totalSeconds * 1000;

  // --- Upcoming birthdays ---
  const upcoming = [];
  for (let i = 1; i <= 4; i++) {
    const b = new Date(birth);
    b.setFullYear(today.getFullYear() + i);
    const weekday = b.toLocaleDateString("en-US", { weekday: "long" });
    upcoming.push({ date: b.toLocaleDateString("en-GB"), day: weekday });
  }

  return {
    today,
    birth,
    years,
    months,
    days,
    nextBirthday: { months: nbMonths, days: nbDays },
    extra: { years, months: totalMonths, weeks: totalWeeks, days: totalDays, hours: totalHours, minutes: totalMinutes, seconds: totalSeconds, milliseconds: totalMilliseconds },
    upcoming
  };
}
