import dayjs from "dayjs";

export const formatDate = (date: Date | string) => {
  return dayjs(date).format("MMMM D, YYYY");
};

export const formatDateTime = (date: Date | string) => {
  return dayjs(date).format("MMMM D, YYYY HH:mm");
};
