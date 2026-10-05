export {};

const osmKl = (await Bun.file(
  `${import.meta.dir}/../.cache/osm-kl.json`,
).json()) as {
  tags: Record<string, string>;
}[];

// console.log(osmKl.length);
// console.log(osmKl[0]);

const tagSum = osmKl
  .map((item) => {
    return Object.keys(item.tags).length;
  })
  .reduce((acc, current) => {
    return acc + current;
  }, 0);

const tagCount = osmKl
  .flatMap((item) => {
    return {
      name: item.tags.name,
      count: Object.keys(item.tags).length,
    };
  })
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

type Postcodes = {
  [key: string]: number;
};

const postcodeCount = osmKl
  .filter((item) => item.tags["addr:postcode"])
  .reduce((acc: Postcodes, current) => {
    const postcode = current.tags["addr:postcode"] as string;
    acc[postcode] = (acc[postcode] ?? 0) + 1;
    return acc;
  }, {} as Postcodes);

const sortedPostcodes = Object.entries(postcodeCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

console.log(sortedPostcodes);

const keysCount = osmKl
  .flatMap((place) => Object.keys(place.tags ?? {}))
  .reduce((acc: { [key: string]: number }, current) => {
    acc[current] = (acc[current] ?? 0) + 1;
    return acc;
  }, {});

console.log(
  Object.entries(keysCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10),
);

// console.log("Average tags: ", tagSum / osmKl.length);
