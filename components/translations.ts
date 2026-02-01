export const t = (key: string) => {
  const dict: Record<string, string> = {
    logout: "התנתק",
    my_account: "האזור האישי",
    choose_file: "בחר קובץ",
  };

  return dict[key] || key;
};
