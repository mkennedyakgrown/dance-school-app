import { Button, Confirm } from "semantic-ui-react";
import { useState } from "react";

function DeleteInstructorButton({ instructor, instructors, setInstructors }) {
  const [deleteActive, setDeleteActive] = useState(false);

  function handleDelete() {
    const body = {
      id: instructor.id,
    };
    fetch(`/api/users/${instructor.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        setInstructors(instructors.filter((i) => i.id !== instructor.id));
        alert("Instructor deleted successfully!");
      });
  }
  return (
    <>
      <Button color="red" type="button" onClick={() => setDeleteActive(true)}>
        Delete
      </Button>
      <Confirm
        open={deleteActive}
        onCancel={() => setDeleteActive(false)}
        onConfirm={handleDelete}
        header="Delete Instructor"
        content="Are you sure you want to delete this instructor?"
        confirmButton="Delete"
        cancelButton="Cancel"
      />
    </>
  );
}

export default DeleteInstructorButton;
