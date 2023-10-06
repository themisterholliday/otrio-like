export function chunk<Type>(arr: Type[], size: number): Type[][] {
  return Array.from(
    {length: Math.ceil(arr.length / size)},
    (_: Type, i: number) => arr.slice(i * size, i * size + size)
  );
}
