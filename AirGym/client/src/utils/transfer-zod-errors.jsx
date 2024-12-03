export const transferZodErrors = (zodError) => {
  const transformedError= {};

  zodError.forEach((issue) => {
    const key = issue.path[0];
    if (!transformedError[key]) {
      transformedError[key] = [];
    }
    transformedError[key].push(issue.message);
  });

  return {
    success: false,
    error: transformedError,
  };
};
