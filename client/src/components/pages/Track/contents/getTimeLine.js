module.exports = (request) => {
  const { user, service_provider, admin, status } = request;
  const timeline = [user, admin, service_provider]
    .map(({ profile, department, signature, staff_id }) =>
      staff_id
        ? {
            name: profile[0].name,
            status: signature || false,
            description: department || "Chief Administration Officer",
          }
        : null
    )
    .filter((node) => node);

  const createObj = (name, status, description) => ({
    name,
    status,
    description,
  });

  return [
    createObj("Created", true, "Request was created sent"),
    ...timeline,
    createObj("Rendered", status >= 1, "Request was rendered"),
    createObj(
      "Archived",
      status === 2,
      "Request was archived by the requester"
    ),
  ];
};
