export default function invariant(condition: boolean, message: string = "Invariant failed"): asserts condition {
  if (!condition) throw new Error(message);
}

export function nonNullable<T>(value: T, message: string = "value cannot be nullable"): NonNullable<T> {
  invariant(value != null, message);
  return value;
}
