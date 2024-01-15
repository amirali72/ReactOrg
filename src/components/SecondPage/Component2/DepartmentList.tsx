import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import departmentData from './departmentData';

export default function HierarchicalCheckbox() {
  const [checkedParents, setCheckedParents] = React.useState<boolean[]>([]);
  const [checkedChildren, setCheckedChildren] = React.useState<boolean[][]>(
    departmentData.map((department) =>
      Array(department.subDepartments.length).fill(false)
    )
  );

  const [expanded, setExpanded] = React.useState<boolean[]>(
    departmentData.map(() => false)
  );

  const handleParentChange =
    (parentIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckedParents = [...checkedParents];
      newCheckedParents[parentIndex] = event.target.checked;
      setCheckedParents(newCheckedParents);

      const newCheckedChildren = checkedChildren.map((childArray, index) =>
        index === parentIndex
          ? childArray.map(() => event.target.checked)
          : childArray
      );
      setCheckedChildren(newCheckedChildren);

      const isExpanded = expanded[parentIndex];
      if (!isExpanded && event.target.checked) {
        const newExpanded = [...expanded];
        newExpanded[parentIndex] = true;
        setExpanded(newExpanded);
      }
    };

  const handleChildChange =
    (parentIndex: number, childIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCheckedChildren = checkedChildren.map((childArray, index) =>
        index === parentIndex
          ? [
              ...childArray.slice(0, childIndex),
              event.target.checked,
              ...childArray.slice(childIndex + 1),
            ]
          : childArray
      );
      setCheckedChildren(newCheckedChildren);

      const allChildrenChecked = newCheckedChildren[parentIndex].every(
        (checked) => checked
      );
      const newCheckedParents = [...checkedParents];
      newCheckedParents[parentIndex] = allChildrenChecked;
      setCheckedParents(newCheckedParents);
    };

  const handleExpand =
    (parentIndex: number) => () => {
      const newExpanded = [...expanded];
      newExpanded[parentIndex] = !newExpanded[parentIndex];
      setExpanded(newExpanded);
    };

  return (
    <div className="dept-list">
      {departmentData.map((department, parentIndex) => (
        <div key={department.id}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleExpand(parentIndex)} size="small">
              {expanded[parentIndex] ? (
                <ExpandMoreIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
            <FormControlLabel
              label={department.name}
              control={
                <Checkbox
                  checked={checkedParents[parentIndex] || false}
                  indeterminate={
                    checkedChildren[parentIndex].some((checked) => checked) &&
                    !checkedChildren[parentIndex].every((checked) => checked)
                  }
                  onChange={handleParentChange(parentIndex)}
                />
              }
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {department.subDepartments.map((subDep, subIndex) => (
              <Collapse in={expanded[parentIndex]} key={subIndex}>
                <FormControlLabel
                  label={subDep}
                  control={
                    <Checkbox
                      checked={checkedChildren[parentIndex][subIndex]}
                      onChange={handleChildChange(parentIndex, subIndex)}
                    />
                  }
                />
              </Collapse>
            ))}
          </Box>
        </div>
      ))}
    </div>
  );
}
