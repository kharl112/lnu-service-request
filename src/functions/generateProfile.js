const Name = (() => {
  const getFullName = (name) =>
    `${name.prefix ? `${name.prefix}.` : ""} ${name.firstname} ${
      name.middle_initial
    }. ${name.lastname} ${name.suffixes.toString()}`;

  const getFixedName = (name) =>
    name.toLowerCase().replace(/^[a-z]/gi, (first) => first.toUpperCase());

  const getFixedFullName = (name) => {
    if (typeof name.suffixes !== "object")
      name.suffixes = name.suffixes.split(",");

    name.middle_initial = name.middle_initial.toUpperCase();
    name.firstname = getFixedName(name.firstname);
    name.lastname = getFixedName(name.lastname);

    return name;
  };

  return { getFullName, getFixedName, getFixedFullName };
})();

const Department = (() => {
  const getDepartment = ({ unit_role, unit_name }) =>
    `${unit_name} ${unit_role === 1 ? "" : "Head"} Department`;
  return { getDepartment };
})();

const Date = (() => {
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
  return { getFullDate };
})();

module.exports = { Name, Date, Department };
