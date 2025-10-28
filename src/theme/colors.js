export const lightColors = {
  primary: '#007AFF',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#e0e0e0',
  error: '#ff3b30',
  success: '#34c759',
  header: '#007AFF',
  searchBackground: '#f5f5f5',
  searchInput: '#ffffff',
  placeholder: '#999999',
};

export const darkColors = {
  primary: '#0a84ff',
  background: '#000000',
  card: '#1c1c1e',
  text: '#ffffff',
  textSecondary: '#ebebf5',
  textTertiary: '#98989d',
  border: '#38383a',
  error: '#ff453a',
  success: '#30d158',
  header: '#1c1c1e',
  searchBackground: '#000000',
  searchInput: '#1c1c1e',
  placeholder: '#98989d',
};

export const getColors = (isDark) => {
  return isDark ? darkColors : lightColors;
};