"use client";
import React, { Fragment, useEffect, useState } from "react";
import "./style.css";
//import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Modal, Button, Form, ModalBody } from "react-bootstrap";
import Data from "../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const CalendarPage = () => {
  const [data, setData] = useState(Data);

  const [days, setDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  const [shifts, setShifts] = useState(["Morning", "Day"]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedShift, setSelectedShift] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCellEvent, setSelectedCellEvent] = useState(null);
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const storedEvents = JSON.parse(localStorage.getItem("newEvents")) || [];
  const [events, setEvents] = useState(storedEvents.map((i) => i));
  const [cellEvents, setCellEvents] = useState(() => {
    const storedCellEvents =
      JSON.parse(localStorage.getItem("cellEvents")) || {};
    return storedCellEvents;
  });

  //image change functions

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleChangeImage = () => {
    // Handle the logic to update the image permanently
    const updatedData = data.map((employee) => {
      if (employee.name === selectedEmployee[0].name) {
        return {
          ...employee,
          image: URL.createObjectURL(selectedImage),
        };
      }
      return employee;
    });

    // Update the data with the new image
    updateEmployeeImage(
      selectedEmployee[0].name,
      URL.createObjectURL(selectedImage)
    );

    // Update the cellEvents state with the new image
    const updatedCellEvents = { ...cellEvents };

    Object.keys(updatedCellEvents).forEach((cell) => {
      updatedCellEvents[cell] = updatedCellEvents[cell].map((event) => {
        const updatedEmployee = event.employee.map((emp) => {
          if (emp.name === selectedEmployee[0].name) {
            return {
              ...emp,
              image: URL.createObjectURL(selectedImage),
            };
          }
          return emp;
        });
        return {
          ...event,
          employee: updatedEmployee,
        };
      });
    });

    setCellEvents(updatedCellEvents);
    localStorage.setItem("cellEvents", JSON.stringify(updatedCellEvents));

    // Update the data state with the new image
    setData(updatedData);

    // Close the modal or perform other actions as needed
    handleModalClose();
  };

  const updateEmployeeImage = (employeeName, newImageUrl) => {
    // In a real-world scenario, you would typically make an API request
    // to your server to update the employee's image URL permanently.

    // Example using fetch (you may need to use a library like Axios for more features):
    fetch(`/api/updateEmployeeImage/${employeeName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: newImageUrl }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update employee image");
        }
        // Handle success
      })
      .catch((error) => {
        console.error("Error updating employee image:", error);
        // Handle error
      });
  };

  const handleEmployeeImageClick = (employee) => {
    setSelectedEmployee([employee]); // Set the selected employee for the modal
    setShowImageModal(true); // Show the new modal
  };

  const handleImageModalClose = () => {
    setSelectedEmployee([]); // Clear the selected employee
    setShowImageModal(false);
  };

  //-----------------------

  const handleAddEventClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveEvent = () => {
    if (selectedDay) {
      const newEvent = {
        id: Date.now().toString(),
        day: selectedDay,
        employee: selectedEmployee.map((employee) => {
          const emp = data.find((e) => e.name === employee.name);
          return {
            name: employee.name,
            image: emp ? employee.image : "",
          };
        }),
        shift: selectedShift,
        role: selectedRole,
      };

      //console.log(newEvent);

      const cellIdentifier = `${selectedDay}-${days.indexOf(selectedDay)}`;
      setCellEvents((prevCellEvents) => ({
        ...prevCellEvents,
        [cellIdentifier]: [...(prevCellEvents[cellIdentifier] || []), newEvent],
      }));

      setEvents((prevEvents) => [...prevEvents, newEvent]);

      localStorage.setItem("cellEvents", JSON.stringify(cellEvents));
      localStorage.setItem("newEvents", JSON.stringify([...events, newEvent]));
      //console.log(cellEvents);
      handleModalClose();
    } else {
      console.error("Please select a day");
    }
  };

  const handleDeleteEvents = () => {
    if (selectedCellEvent !== null) {
      const { eventArray, cell } = selectedCellEvent;
      const updatedCellEvents = {
        ...cellEvents,
        [cell]: cellEvents[cell].filter(
          (e) => !eventArray.some((evt) => e.id === evt.id)
        ),
      };

      setCellEvents(updatedCellEvents);
      localStorage.setItem("cellEvents", JSON.stringify(updatedCellEvents));
      setSelectedCellEvent(null);
      setIsDeleteButtonEnabled(false);
    }
  };

  const handleOnDrag = (e, item) => {
    e.dataTransfer.setData("event", JSON.stringify(item));
  };

  const handleOnDrop = (e, destinationCell) => {
    e.preventDefault();

    const eventType = JSON.parse(e.dataTransfer.getData("event"));
    const sourceCell = eventType.cell;

    // Check if sourceCell exists in cellEvents before updating
    if (sourceCell && cellEvents[sourceCell]) {
      // Remove the dragged event from the source cell
      const updatedCellEvents = {
        ...cellEvents,
        [sourceCell]: cellEvents[sourceCell].filter(
          (e) => e.id !== eventType.id
        ),
      };

      // Update the day property of the dragged event
      eventType.day = destinationCell.split("-")[0];

      // Add the dragged event to the destination cell
      updatedCellEvents[destinationCell] = [
        ...(updatedCellEvents[destinationCell] || []),
        eventType,
      ];

      setCellEvents(updatedCellEvents);
      localStorage.setItem("cellEvents", JSON.stringify(updatedCellEvents));
    } else {
      // Handle the case where the sourceCell is not found
      console.error("Source cell not found");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCellEventClick = (event, cell) => {
    const eventArray = [event];
    setSelectedCellEvent((prevSelectedCellEvent) => {
      if (prevSelectedCellEvent && prevSelectedCellEvent.cell === cell) {
        return null;
      } else {
        return { eventArray, cell };
      }
    });
  };

  const handleCheckboxChange = (emp) => {
    const updatedSelectedEmployees = emp.map((employee) => ({
      name: employee.name,
      image: employee.image,
    }));

    setSelectedEmployee((prevSelectedEmployees) => {
      const isEmployeeSelected = prevSelectedEmployees.some(
        (employee) => employee.name === updatedSelectedEmployees[0].name
      );

      if (isEmployeeSelected) {
        // If the employee is already selected, remove it
        const filteredSelectedEmployees = prevSelectedEmployees.filter(
          (employee) => employee.name !== updatedSelectedEmployees[0].name
        );

        return filteredSelectedEmployees;
      } else {
        // If the employee is not selected, add it
        return [...prevSelectedEmployees, ...updatedSelectedEmployees];
      }
    });
  };

  useEffect(() => {
    //console.log(selectedEmployee);
  }, [selectedEmployee]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("cellEvents", JSON.stringify(cellEvents));
  }, [cellEvents]);

  return (
    <>
      <main className="main px-4 calendar">
        {/* ------------- Buttons --------- */}
        <div className="row d-flex justify-content-end align-items-center px-4">
          <div className="d-flex flex-row justify-content-center">
            <button
              type="button"
              className="btn btn-outline-dark me-2"
              data-bs-toggle="button"
              aria-pressed="true"
            >
              prev
            </button>
            <h2>Weeks</h2>
            <button
              type="button"
              className="btn btn-outline-dark ms-2"
              data-bs-toggle="button"
              aria-pressed="true"
            >
              next
            </button>
            <button
              className="btn btn-primary ms-auto me-2 add"
              onClick={handleAddEventClick}
            >
              Add Events
            </button>
            <button
              className={`btn btn-secondary mx-3 delete ${
                isDeleteButtonEnabled ? "" : "disable"
              }`}
              onClick={handleDeleteEvents}
              disabled={!selectedCellEvent}
            >
              Delete Events
            </button>
          </div>
        </div>

        <div className="row d-flex justify-content-center py-3">
          {/* -------- Table -------- */}
          <div className="col-12 col-md-12 col-lg-12">
            <table>
              <tbody>
                <tr>
                  {days.map((item, index) => {
                    return (
                      <td key={index} className="day">
                        {item}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  {days.map((day, dayIndex) => {
                    const cellIdentifier = `${day}-${dayIndex}`;
                    const eventsForCell = cellEvents[cellIdentifier] || [];
                    return (
                      <td
                        key={dayIndex}
                        className="day"
                        onDrop={(e) => handleOnDrop(e, cellIdentifier)}
                        onDragOver={(e) => handleDragOver(e, cellIdentifier)}
                      >
                        {eventsForCell.map((event, index) => {
                          const isSelected =
                            selectedCellEvent &&
                            selectedCellEvent.eventArray.some(
                              (selectedEvent) => selectedEvent.id === event.id
                            );
                          return (
                            <div
                              key={index}
                              className="row d-flex event-table"
                              onClick={() =>
                                handleCellEventClick(event, cellIdentifier)
                              }
                              draggable
                              onDragStart={(e) =>
                                handleOnDrag(e, {
                                  ...event,
                                  cell: cellIdentifier,
                                })
                              }
                            >
                              <div
                                className={`event-cell ${
                                  isSelected ? "selected" : ""
                                }`}
                              >
                                <div className="row d-flex align-items-center">
                                  <div className="col-6 d-flex justify-content-center px-2">
                                    <b>{event.day}</b>
                                  </div>
                                  <div className="col-6 d-flex justify-content-start px-2">
                                    <p
                                      className={
                                        event.shift == "Night" ? "night" : "day"
                                      }
                                    >
                                      {event.shift == "Night" ? (
                                        <FontAwesomeIcon icon={faMoon} />
                                      ) : (
                                        <FontAwesomeIcon icon={faCloudSun} />
                                      )}

                                      {event.shift}
                                    </p>
                                  </div>
                                </div>

                                {event.employee.map((emp, index) => (
                                  <img
                                    key={index}
                                    src={
                                      index === 0 &&
                                      selectedEmployee.length > 0 &&
                                      selectedImage
                                        ? URL.createObjectURL(selectedImage)
                                        : emp.image
                                    }
                                    onClick={() =>
                                      handleEmployeeImageClick(emp)
                                    }
                                  />
                                ))}
                                <p>Total Emp: {event.employee.length}</p>
                                <p>
                                  {/* {event.role === "Cooker" ? (
                                  <img src="/cooker.png" alt="" />
                                ) : event.role === "Cashier" ? (
                                  <img src="/cashier.webp" alt="" />
                                ) : (
                                  <img src="/jumper.png" alt="" />
                                )} */}
                                  Role: <b>{event.role}</b>
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          {/*--------------------- */}
        </div>
      </main>
      {/* Modal for adding events */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDay">
              <Form.Label> Select a day</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option>Days</option>
                {days.map((day, index) => (
                  <option key={index}>{day}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEmployee">
              <Form.Label>Select Employees</Form.Label>
              {data.map((emp, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={
                    <div className="d-flex align-items-center">
                      <img
                        src={emp.image}
                        alt={`${emp.name}'s image`}
                        style={{
                          marginRight: "8px",
                          width: "24px",
                          height: "24px",
                        }}
                      />
                      {emp.name}
                    </div>
                  }
                  onChange={() => handleCheckboxChange([emp])}
                  checked={selectedEmployee.some((e) => e.name === emp.name)}
                />
              ))}
            </Form.Group>

            <Form.Group controlId="formShift">
              <Form.Label>Choose Shifts</Form.Label>
              <Form.Check
                type="checkbox"
                label="Day"
                onChange={() => setSelectedShift(["Day"])}
              />
              <Form.Check
                type="checkbox"
                label="Night"
                onChange={() => setSelectedShift(["Night"])}
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label> Select Work Role</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option>Work Role</option>
                <option value="Cashier">Cashier</option>
                <option value="Cooker">Cooker</option>
                <option value="Jumper">Jumper</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEvent}>
            Save Event
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={handleImageModalClose}>
        <Modal.Body>
          <Form.Group controlId="formImage">
            <Form.Label>Change Employee Image</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleImageModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleChangeImage}>
              Change Image
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalendarPage;
