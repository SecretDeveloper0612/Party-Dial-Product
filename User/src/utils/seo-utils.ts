export const formatSlugToName = (slug: string) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatNameToSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};
