import React from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Event = ({ event, onDragStart, isSelected, handleEventClick, drag }) => {
  //   const [{ isDragging }, drag] = useDrag({
  //     type: "EVENT",
  //     item: { event },
  //     collect: (monitor) => ({
  //       isDragging: !!monitor.isDragging(),
  //     }),
  //   });

  return (
    <div
      ref={drag}
      className={`event-cell d-table-cell ${
        isSelected ? "selected" : ""
      } draggable-event ${isDragging ? "dragging" : ""}`}
      onClick={() => handleEventClick(event)}
    >
      {/* Render your event content here */}
      <p>{event.day}</p>
      <p>{event.employee}</p>
      <p className="light">Shift: {event.shift}</p>
      <p className="light">Role: {event.role}</p>
      {/* ... other event details */}
    </div>
  );
};
export default Event;
