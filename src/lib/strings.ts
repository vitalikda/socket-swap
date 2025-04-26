export const shortenAddress = ({
  address,
  start = 6,
  end = 4,
}: {
  address: string;
  start?: number;
  end?: number;
}) => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};
