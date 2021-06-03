const getFullName = (name) =>
  `${name.prefix ? `${name.prefix}.` : ""} ${name.firstname} ${
    name.middle_initial
  }. ${name.lastname} ${name.suffixes.toString()}`;

const getDepartment = ({ unit_role, unit_name }) =>
  `${unit_name} ${unit_role === 1 ? "" : "Head"} Department`;

const getFixedName = (name) =>
  name.toLowerCase().replace(/^[a-z]/gi, (first) => first.toUpperCase());

const getFullDate = (date) => {
  const new_date = new Date(date);
  return `${
    new_date.getMonth() + 1 < 10
      ? `0${new_date.getMonth() + 1}`
      : new_date.getMonth() + 1
  }/${
    new_date.getDate() < 10 ? `0${new_date.getDate()}` : new_date.getDate()
  }/${new_date.getFullYear()}`;
};

module.exports = { getFullName, getDepartment, getFixedName, getFullDate };
