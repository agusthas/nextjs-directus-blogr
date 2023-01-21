export const generateRandomAvatar = () => {
  const url = new URL("https://api.dicebear.com/5.x/lorelei/svg");
  url.searchParams.append("seed", Math.random().toString());
  return url.toString();
};
