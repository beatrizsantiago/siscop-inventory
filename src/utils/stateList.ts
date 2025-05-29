export const STATE_LABELS:{ [key: string]: string } = {
  WAITING: 'Aguardando plantio',
  IN_PRODUCTION: 'Em produção',
  READY: 'Colhido',
};

export const STATE_OPTIONS = Object.keys(STATE_LABELS).map((key) => ({
  value: key,
  label: STATE_LABELS[key],
}));
