import { useState, useEffect } from "react";
import {
  Header,
  Button,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableBody,
} from "semantic-ui-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import SuggestionRow from "../components/SuggestionRow";

/**
 * Component for displaying suggestions.
 * Fetches suggestions, courses, disciplines, levels, and genders from the API.
 * Allows for sorting suggestions by course, discipline, level, and gender.
 * Displays a table with suggestions and allows for deleting suggestions.
 */
function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [levels, setLevels] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sortSelection, setSortSelection] = useState("");

  const { user } = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login or reports page if user is not logged in or does not have admin role
    if (!user.email_address) {
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
    // Fetch suggestions, courses, disciplines, levels, and genders from the API
    fetch("/api/suggestions")
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data);
      });
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    fetch("/api/disciplines")
      .then((r) => r.json())
      .then((data) => {
        setDisciplines(data);
      });
    fetch("/api/levels")
      .then((r) => r.json())
      .then((data) => {
        setLevels(data);
      });
    fetch("/api/genders")
      .then((r) => r.json())
      .then((data) => {
        setGenders(data);
      });
  }, []);

  /**
   * Deletes a suggestion from the state and the database.
   * @param {number} suggestionId - The ID of the suggestion to delete.
   */
  function handleDelete(suggestionId) {
    fetch(`/api/suggestions/${suggestionId}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(
          suggestions.filter((suggestion) => suggestion.id !== suggestionId)
        );
      });
  }

  // Generate options for dropdown menus
  const courseOptions =
    courses.length > 0
      ? courses.map((course) => {
          return {
            key: course.id,
            text: course.name,
            value: course.id,
          };
        })
      : [];

  const disciplineOptions =
    disciplines.length > 0
      ? disciplines.map((discipline) => {
          return {
            key: discipline.id,
            text: discipline.name,
            value: discipline.id,
          };
        })
      : [];

  const levelOptions =
    levels.length > 0
      ? levels.map((level) => {
          return {
            key: level.id,
            text: level.name,
            value: level.id,
          };
        })
      : [];

  const genderOptions =
    genders.length > 0
      ? genders.map((gender) => {
          return {
            key: gender.id,
            text: gender.name,
            value: gender.id,
          };
        })
      : [];

  // Generate rows for each suggestion
  const suggestionRows =
    suggestions.length > 0
      ? suggestions.map((suggestion) => {
          return (
            <SuggestionRow
              key={suggestion.id}
              {...{
                suggestion,
                courseOptions,
                disciplineOptions,
                levelOptions,
                genderOptions,
                handleDelete,
                suggestions,
                setSuggestions,
              }}
            />
          );
        })
      : null;

  /**
   * Sorts suggestions by course name in ascending order.
   */
  function sortSuggestionsByCourse() {
    const sortedSuggestions = [...suggestions];
    sortedSuggestions.sort((a, b) => {
      if (a.course.name < b.course.name) {
        return -1;
      }
      if (a.course.name > b.course.name) {
        return 1;
      }
      return 0;
    });
    setSuggestions(sortedSuggestions);
    setSortSelection("course");
  }

  /**
   * Sorts suggestions by discipline name in ascending order.
   */
  function sortSuggestionsByDiscipline() {
    const sortedSuggestions = [...suggestions];
    sortedSuggestions.sort((a, b) => {
      if (a.discipline) {
        if (a.discipline.name < b.discipline.name) {
          return -1;
        }
        if (a.discipline.name > b.discipline.name) {
          return 1;
        }
      }
      return 0;
    });
    setSuggestions(sortedSuggestions);
    setSortSelection("discipline");
  }

  /**
   * Sorts suggestions by level name in ascending order.
   */
  function sortSuggestionsByLevel() {
    const sortedSuggestions = [...suggestions];
    sortedSuggestions.sort((a, b) => {
      if (a.level) {
        if (a.level.name < b.level.name) {
          return -1;
        }
        if (a.level.name > b.level.name) {
          return 1;
        }
      }
      return 0;
    });
    setSuggestions(sortedSuggestions);
    setSortSelection("level");
  }

  /**
   * Sorts suggestions by gender name in ascending order.
   */
  function sortSuggestionsByGender() {
    const sortedSuggestions = [...suggestions];
    sortedSuggestions.sort((a, b) => {
      if (a.gender) {
        if (a.gender.name < b.gender.name) {
          return -1;
        }
        if (a.gender.name > b.gender.name) {
          return 1;
        }
      }
      return 0;
    });
    setSuggestions(sortedSuggestions);
    setSortSelection("gender");
  }

  return (
    <>
      <Header as="h1">Suggestions</Header>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Suggest</TableHeaderCell>
            <TableHeaderCell>If</TableHeaderCell>
          </TableRow>
          <TableRow>
            <TableCell
              onClick={() => sortSuggestionsByCourse()}
              active={sortSelection === "course"}
            >
              Course
            </TableCell>
            <TableCell
              onClick={() => sortSuggestionsByDiscipline()}
              active={sortSelection === "discipline"}
            >
              Discipline
            </TableCell>
            <TableCell
              onClick={() => sortSuggestionsByLevel()}
              active={sortSelection === "level"}
            >
              Level
            </TableCell>
            <TableCell
              onClick={() => sortSuggestionsByGender()}
              active={sortSelection === "gender"}
            >
              Gender
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SuggestionRow
            key="new-suggestion"
            {...{
              suggestion: null,
              courseOptions,
              disciplineOptions,
              levelOptions,
              genderOptions,
              handleDelete,
              suggestions,
              setSuggestions,
            }}
          />
          {suggestionRows}
        </TableBody>
      </Table>
    </>
  );
}

export default Suggestions;
