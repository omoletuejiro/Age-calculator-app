const btn = document.getElementById('calculate-btn');

btn.addEventListener('click', calculateAge);

function setError(inputEl, messageEl, msg) {
  inputEl.classList.add('input-error');
  messageEl.textContent = msg;
}

function clearError(inputEl, messageEl) {
  inputEl.classList.remove('input-error');
  messageEl.textContent = '';
}

function resetResults() {
  document.getElementById('years').textContent = '--';
  document.getElementById('months').textContent = '--';
  document.getElementById('days').textContent = '--';
}

function calculateAge() {
  const dayEl = document.getElementById('day');
  const monthEl = document.getElementById('month');
  const yearEl = document.getElementById('year');

  const dayError = document.getElementById('day-error');
  const monthError = document.getElementById('month-error');
  const yearError = document.getElementById('year-error');

  // clear previous errors
  clearError(dayEl, dayError);
  clearError(monthEl, monthError);
  clearError(yearEl, yearError);

  // parse ints safely
  const day = parseInt(dayEl.value, 10);
  const month = parseInt(monthEl.value, 10);
  const year = parseInt(yearEl.value, 10);

  const today = new Date();
  const currentYear = today.getFullYear();

  let valid = true;

  // Validate month first (1-12)
  if (Number.isNaN(month) || month < 1 || month > 12) {
    setError(monthEl, monthError, 'Must be a valid month');
    valid = false;
  }

  // Validate year (present and not future)
  if (Number.isNaN(year)) {
    setError(yearEl, yearError, 'Must be a valid year');
    valid = false;
  } else if (year > currentYear) {
    setError(yearEl, yearError, 'Must be in the past');
    valid = false;
  } else if (year < 1) {
    setError(yearEl, yearError, 'Must be a valid year');
    valid = false;
  }

  // Validate day with month/year context
  if (Number.isNaN(day) || day < 1) {
    setError(dayEl, dayError, 'Must be a valid day');
    valid = false;
  } else if (!Number.isNaN(month) && !Number.isNaN(year)) {
    // days in the given month (handles leap years)
    // Note: new Date(year, month, 0) -> last day of previous month if month is 1-based;
    // but with month (1..12), new Date(year, month, 0).getDate() returns days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      setError(dayEl, dayError, 'Must be a valid day');
      valid = false;
    }
  }

  // If basic validation failed, reset results and abort
  if (!valid) {
    resetResults();
    return;
  }

  // Build birth date (month index is 0-based)
  const birth = new Date(year, month - 1, day);

  // Birth cannot be in the future
  if (birth > today) {
    setError(yearEl, yearError, 'Must be in the past');
    resetResults();
    return;
  }

  // Now computer years/months/days
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    // borrow days from previous month
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  // Final guard (shouldn't be negative if birth <= today)
  if (years < 0) {
    setError(yearEl, yearError, 'Must be in the past');
    resetResults();
    return;
  }

  // Display results
  document.getElementById('years').textContent = years;
  document.getElementById('months').textContent = months;
  document.getElementById('days').textContent = days;
}
