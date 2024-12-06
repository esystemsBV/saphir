const date = new Date();

interface currentProps {
  day: number;
  year: number;
  month: number;
  date: string;
}

export const currentdata: currentProps = {
  day: date.getDay(),
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  date: `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`,
};
