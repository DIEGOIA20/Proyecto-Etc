export const lightTheme = {
  bg: '#F9FAFB',
  card: '#ffffff',
  title: '#111827',
  text: '#111827',
  sub: '#6B7280',
  inputBg: '#ffffff',
  border: '#E5E7EB',
  detailBg: '#F3F4F6',
  separator: '#F3F4F6',
};

export const darkTheme = {
  bg: '#111827',
  card: '#1F2937',
  title: '#F9FAFB',
  text: '#E5E7EB',
  sub: '#9CA3AF',
  inputBg: '#374151',
  border: '#4B5563',
  detailBg: '#374151',
  separator: '#374151',
};

export const getTheme = (isDark) => (isDark ? darkTheme : lightTheme);
