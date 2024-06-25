import { useState } from "react";
import { List, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";

function PlacementStudentListItem({ student, currCourse, setCurrCourse }) {
  const [isHidden, setIsHidden] = useState(true);

  const formSchemaRemove = yup.object().shape({
    remove_student_id: yup.number().required(),
  });

  const formikRemove = useFormik({
    initialValues: {
      remove_student_id: "",
    },
    validationSchema: formSchemaRemove,
    onSubmit: (values) => {
      fetch(`/api/courses/${currCourse.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remove_student_ids: [values.remove_student_id],
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setCurrCourse(data);
          formikRemove.resetForm();
        });
    },
  });

  return (
    <List.Item
      key={`course-${currCourse.id}student-${student.id}`}
      value={student.id}
      onClick={() => {
        setIsHidden(!isHidden);
        formikRemove.setFieldValue("remove_student_id", student.id);
      }}
    >
      {`${student.first_name} ${student.last_name}`}
      {isHidden ? null : (
        <Button
          onClick={() => {
            formikRemove.handleSubmit();
            setIsHidden(true);
          }}
          type="submit"
          color="red"
        >
          Remove
        </Button>
      )}
    </List.Item>
  );
}

export default PlacementStudentListItem;
