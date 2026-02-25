import { Progress, Tooltip } from '@mantine/core';

const AppReqItemProgress = (props: {
  itemCount: number;
  itemOpen: number;
  itemProcess: number;
  itemClose: number;
}) => {
  const { itemCount, itemOpen, itemProcess, itemClose } = props;
  return (
    <Progress.Root size="xl">
      <Tooltip label={`Open - ${itemOpen}`}>
        <Progress.Section value={(itemOpen / itemCount) * 100} color="blue">
          <Progress.Label>{itemOpen}</Progress.Label>
        </Progress.Section>
      </Tooltip>

      <Tooltip label={`Process - ${itemProcess}`}>
        <Progress.Section value={(itemProcess / itemCount) * 100} color="orange">
          <Progress.Label>{itemProcess}</Progress.Label>
        </Progress.Section>
      </Tooltip>

      <Tooltip label={`Close - ${itemClose}`}>
        <Progress.Section value={(itemClose / itemCount) * 100} color="green">
          <Progress.Label>{itemClose}</Progress.Label>
        </Progress.Section>
      </Tooltip>
    </Progress.Root>
  );
};

export default AppReqItemProgress;
