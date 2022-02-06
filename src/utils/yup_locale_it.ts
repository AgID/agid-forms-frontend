const LOCALIZED_TYPES: Record<string, string> = {
  number: "numerico",
  string: "stringa",
  date: "data",
  boolean: "booleano",
  object: "oggetto",
  array: "array",
  mixed: "mixed"
};

export const mixed = {
  default: "non ha un formato valido",
  required: "è un campo richiesto",
  oneOf: "deve avere uno tra i seguenti valori: ${values}",
  notOneOf: "non deve avere il valore: ${values}",
  notType: ({ type }: { type: string }) => {
    return `deve essere di tipo ${LOCALIZED_TYPES[type]}`;
  }
};

// tslint:disable-next-line: variable-name
export const string = {
  length: "deve essere di esattamente ${length} caratteri",
  min: "deve avere almeno ${min} caratteri",
  max: "deve avere al massimo ${max} caratteri",
  matches: 'deve essere del formato: "${regex}"',
  email: "dev'essere un'email valida",
  url: "dev'essere un indirizzo web valido",
  trim: "dev'essere una stringa senza spazi alla fine o all'inizio",
  lowercase: "dev'essere in minuscolo",
  uppercase: "deve essere in maiuscolo"
};

// tslint:disable-next-line: variable-name
export const number = {
  min: "deve essere maggiore o uguale a ${min}",
  max: "deve essere minore o uguale a ${max}",
  lessThan: "deve essere minore di ${less}",
  moreThan: "deve essere maggiore di ${more}",
  notEqual: "deve differire da ${notEqual}",
  positive: "deve essere un numero positivo",
  negative: "deve essere un numero negativo",
  integer: "deve essere un intero"
};

export const date = {
  min: ({ min }: { min: Date }) => ({ key: 'date_too_early', values: { min: min.toLocaleDateString() } }),
  max: ({ max }: { max: Date }) => ({ key: 'date_too_late', values: { max: max.toLocaleDateString() } }),
};

// tslint:disable-next-line: variable-name
export const boolean = {};

export const object = {
  noUnknown: "possiede delle proprietà non riconosciute"
};

export const array = {
  min: "deve avere almeno ${min} elementi selezionati",
  max: "deve avere al massimo ${max} elementi selezionati"
};

export const ItLocale = {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean
};
