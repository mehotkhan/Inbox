export default () => {
  const isDark = useCookie("isDark", {
    default: () =>
      window?.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
    watch: true,
    maxAge: cookieExpire,
  });

  const toggleDark = () => {
    isDark.value = !isDark.value;
  };
  return {
    isDark,
    toggleDark,
  };
};
