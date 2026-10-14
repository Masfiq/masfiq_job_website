/** Anchor id for a project card, shared by the card and links that point to it. */
export const projectId = (title: string) => `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
