import { TableRow, TableCell, Button, Confirm } from "semantic-ui-react";
import { useState } from "react";
import InstructorRowEdit from "./InstructorRowEdit";
import DeleteInstructorButton from "./DeleteInstructorButton";

function InstructorRow({
  instructor,
  instructors,
  setInstructors,
  courseOptions,
  roles,
  courses,
}) {
  const [editActive, setEditActive] = useState(!instructor ? true : false);

  return (
    <>
      {editActive ? (
        <InstructorRowEdit
          instructor={instructor}
          instructors={instructors}
          setInstructors={setInstructors}
          courseOptions={courseOptions}
          roles={roles}
          setEditActive={setEditActive}
          courses={courses}
        />
      ) : instructor ? (
        <TableRow key={instructor.id}>
          <TableCell>{instructor.first_name}</TableCell>
          <TableCell>{instructor.last_name}</TableCell>
          <TableCell>
            {instructor.roles.map((role) => role.name).join(", ")}
          </TableCell>
          <TableCell>{instructor.email_address}</TableCell>
          <TableCell>
            {instructor.courses.map((course) => course.name).join(", ")}
          </TableCell>
          <TableCell>
            <Button
              type="button"
              onClick={() => {
                setEditActive(true);
              }}
            >
              Edit
            </Button>
            <DeleteInstructorButton
              {...{ instructor, instructors, setInstructors }}
            />
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}

export default InstructorRow;
