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
import SuggestionRow from "../components/SuggestionRow";

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [levels, setLevels] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sortSelection, setSortSelection] = useState("");

  useEffect(() => {
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
