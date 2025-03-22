

export const requireEnv = (value: any, key: string): string => {
  if (!value) {
    throw new Error('Env var ' + key + ' is required');
  }

  return value as string
}
