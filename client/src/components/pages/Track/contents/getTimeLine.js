module.exports = (request) => {
  const { user, service_provider, admin } = request;
  const timeline = [user, admin, service_provider]
    .map((node) =>
      node.staff_id
        ? {
            name: node.profile[0].name,
            status: node.signature || false,
            description: node.department || "Chief Administration Officer",
            reports: node.reports || { date: request.reports.dates.created },
          }
        : null
    )
    .filter((node) => node);

  const createObj = (name, status, reports) => ({
    name,
    status,
    reports,
  });

  return [
    createObj("This request created.", true, {
      date: request.reports.dates.created,
    }),
    createObj("This request was sent.", !!request.reports.dates.sent, {
      date: request.reports.dates.sent,
    }),
    ...timeline,
    createObj(
      "This request was completed.",
      !!request.reports.dates.completed,
      {
        date: request.reports.dates.completed,
      }
    ),
    createObj("This request was archived", !!request.reports.dates.archived, {
      date: request.reports.dates.archived,
    }),
  ];
};
