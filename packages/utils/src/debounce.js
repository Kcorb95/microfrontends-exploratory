/**
 * Create a debounced function that delays invoking the provided function
 * @template T
 * @param {T} fn - The function to debounce
 * @param {number} [delay] - Delay in milliseconds (default: 300)
 * @returns {T & { cancel: () => void }} Debounced function with cancel method
 */
export function debounce(fn, delay = 300) {
  let timeoutId = null;

  const debounced = function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };

  debounced.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Create a throttled function that only invokes the provided function at most once per interval
 * @template T
 * @param {T} fn - The function to throttle
 * @param {number} [interval] - Interval in milliseconds (default: 300)
 * @returns {T} Throttled function
 */
export function throttle(fn, interval = 300) {
  let lastTime = 0;
  let timeoutId = null;

  return function (...args) {
    const now = Date.now();
    const remaining = interval - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
