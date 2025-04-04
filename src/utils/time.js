export const disablePastTime = () => {
  return new Date().toISOString().slice(0, 16);
};

export const disableEndTime = (start_time, duration) => {
    if (!start_time) return "";

    const startDate = new Date(start_time + ":00.000Z");
    const endDate = new Date(startDate.getTime() + (duration + 60) * 60 * 1000);

    return endDate.toISOString().slice(0, 16);
  };


export const checkDuplicateShowtime = (
  listShowtimes,
  roomId,
  startTime,
  endTime
) => {
  return listShowtimes.some((showtime) => {
    const existingStart = new Date(showtime.start_time).getTime();
    const existingEnd = new Date(showtime.end_time).getTime();
    const existingRoom = Number(showtime.room_id);

    return (
      existingRoom === roomId &&
      ((startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd))
    );
  });
};
