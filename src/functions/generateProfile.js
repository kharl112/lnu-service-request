const getFullName = (name) =>
  `${name.prefix ? `${name.prefix}.` : ""} ${name.firstname} ${
    name.middle_initial
  }. ${name.lastname} ${name.suffixes.toString()}`;

const getDepartment = ({ unit_role, unit_name }) =>
  `${unit_name} ${unit_role === 1 ? "" : "Head"} Department`;

module.exports = { getFullName, getDepartment };
