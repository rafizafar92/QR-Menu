export const parseDbDate = (s: string) =>
  new Date(/(Z|[+-]\d{2}:?\d{2})$/i.test(s) ? s : s.replace(' ', 'T') + 'Z');
