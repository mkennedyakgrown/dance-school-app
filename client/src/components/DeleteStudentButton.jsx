import { Button, Confirm } from "semantic-ui-react";
import { useState } from "react";

function DeleteStudentButton({ studentId, students, setStudents, formik }) {
  const [deleteActive, setDeleteActive] = useState(false);

  function handleDelete() {
    const body = {
      id: studentId,
    };
    fetch(`/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        setStudents(students.filter((i) => i.id !== studentId));
        alert("Student deleted successfully!");
        setDeleteActive(false);
        formik.resetForm();
      });
  }
  return (
    <>
      <Button color="red" type="button" onClick={() => setDeleteActive(true)}>
        Delete Student
      </Button>
      <Confirm
        open={deleteActive}
        onCancel={() => setDeleteActive(false)}
        onConfirm={handleDelete}
        header="Delete Student"
        content="Are you sure you want to delete this student?"
        confirmButton="Delete"
        cancelButton="Cancel"
      />
    </>
  );
}

export default DeleteStudentButton;
