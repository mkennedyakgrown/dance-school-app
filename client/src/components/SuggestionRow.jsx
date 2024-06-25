import { TableRow, TableCell, Dropdown, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";

function SuggestionRow({
  suggestion,
  courseOptions,
  disciplineOptions,
  levelOptions,
  genderOptions,
  handleDelete,
  suggestions,
  setSuggestions,
}) {
  const formSchema = yup.object().shape({
    course: yup.string().required(),
    discipline: yup.string(),
    level: yup.string(),
    gender: yup.string(),
  });

  const formik = useFormik({
    initialValues: suggestion
      ? {
          course: suggestion.course ? suggestion.course.id : "",
          discipline: suggestion.discipline ? suggestion.discipline.id : "",
          level: suggestion.level ? suggestion.level.id : "",
          gender: suggestion.gender ? suggestion.gender.id : "",
        }
      : {
          course: "",
          discipline: "",
          level: "",
          gender: "",
        },
    validationSchema: formSchema,
    onSubmit: (values) => {
      if (suggestion) {
        const body = { course_id: values.course };
        if (values.discipline !== "") {
          body.discipline_id = values.discipline;
        }
        if (values.level !== "") {
          body.level_id = values.level;
        }
        if (values.gender !== "") {
          body.gender_id = values.gender;
        }
        fetch(`/api/suggestions/${suggestion.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
          });
      } else {
        const body = { course_id: values.course };
        if (values.discipline !== "") {
          body.discipline_id = values.discipline;
        }
        if (values.level !== "") {
          body.level_id = values.level;
        }
        if (values.gender !== "") {
          body.gender_id = values.gender;
        }
        fetch("/api/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((r) => r.json())
          .then((data) => {
            setSuggestions([...suggestions, data]);
            formik.resetForm();
          });
      }
    },
  });

  return (
    <TableRow key={suggestion ? suggestion.id : "new-suggestion"}>
      <TableCell>
        <Dropdown
          search
          name="course-dropdown"
          placeholder="Select a Course"
          options={courseOptions}
          value={formik.values.course}
          onChange={(e, { value }) => {
            formik.setFieldValue("course", value);
          }}
        />
      </TableCell>
      <TableCell>
        <Dropdown
          search
          name="discipline-dropdown"
          placeholder="Discipline"
          options={disciplineOptions}
          value={formik.values.discipline}
          onChange={(e, { value }) => {
            formik.setFieldValue("discipline", value);
          }}
        />
      </TableCell>
      <TableCell>
        <Dropdown
          search
          name="level-dropdown"
          placeholder="Level"
          options={levelOptions}
          value={formik.values.level}
          onChange={(e, { value }) => {
            formik.setFieldValue("level", value);
          }}
        />
      </TableCell>
      <TableCell>
        <Dropdown
          search
          name="gender-dropdown"
          placeholder="Gender"
          options={genderOptions}
          value={formik.values.gender}
          onChange={(e, { value }) => {
            formik.setFieldValue("gender", value);
          }}
        />
      </TableCell>
      <TableCell>
        <Button type="submit" onClick={() => formik.handleSubmit()}>
          Save
        </Button>
      </TableCell>
      <TableCell>
        <Button type="button" onClick={() => handleDelete(suggestion.id)}>
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default SuggestionRow;
