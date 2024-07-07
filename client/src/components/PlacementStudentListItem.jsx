import { useState } from "react";
import { List, Button } from "semantic-ui-react";

function PlacementStudentListItem({ placement, currCourse, setCurrCourse }) {
  const [isHidden, setIsHidden] = useState(true);

  function handleDeletePlacement() {
    fetch(`/api/placements/${placement.id}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((data) => {
        setCurrCourse({
          ...currCourse,
          placements: currCourse.placements.filter(
            (p) => p.id !== placement.id
          ),
        });
      });
  }

  return (
    <List.Item
      key={`course-${currCourse.id}student-${placement.student.id}`}
      value={placement.id}
      onClick={() => {
        setIsHidden(!isHidden);
      }}
    >
      {`${placement.student.first_name} ${placement.student.last_name}`}
      {isHidden ? null : (
        <Button
          onClick={() => {
            handleDeletePlacement();
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
