import React from "react";
import { useTimer } from "react-timer-hook";

const Timer = (props) => {
  const MINUTES = props.time_limit * 60;
  const time = new Date();
  time.setSeconds(time.getSeconds() + MINUTES);

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: time,
    onExpire: () => props.submitTest(),
  });

  return (
    <h2 className="text-center mb-3 mt-3">
      Timer: {hours}:{minutes}:{seconds}
    </h2>
  );
};

export default Timer;
