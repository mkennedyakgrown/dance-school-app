import {
  TableRow,
  TableCell,
  Button,
  Icon,
  Input,
  Dropdown,
  List,
} from "semantic-ui-react";
import { useState } from "react";
import InstructorRowEdit from "./InstructorRowEdit";

function InstructorRow({
  instructor,
  instructors,
  setInstructors,
  courseOptions,
  roles,
  courses,
}) {
  const [editActive, setEditActive] = useState(false);

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
      ) : (
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
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default InstructorRow;
