export const StreamResponses = {
  STREAM_ALREADY_EXISTS: (name: string) => `Stream with name "${name}" already exists.`,
  STREAM_NOT_FOUND: (name: string) => `No stream found with name "${name}".`,
};
