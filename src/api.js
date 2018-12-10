import { OPENROUTESERVICE_KEY } from 'react-native-dotenv';
import { Directions, Isochrones, Pois } from 'openrouteservice-js';
import R from 'ramda';

async function getBoundingBox(coordinate, range) {
  const api = new Isochrones({ api_key: OPENROUTESERVICE_KEY });
  return api.calculate({
    locations: [coordinate],
    profile: 'cycling-regular',
    range_type: 'distance',
    range,
  }).then(result => R.splitEvery(2, result.bbox));
}

export async function getPois(coordinate, types = [], range = 7000) {
  const api = new Pois({ api_key: OPENROUTESERVICE_KEY });
  const bbox = await getBoundingBox(coordinate, Math.min(range, 7000));

  const isGroupCategory = type => type % 10 == 0;
  const groups = types.filter(isGroupCategory);
  const categories = types.filter(R.complement(isGroupCategory));

  return api.pois({
    request: 'pois',
    geometry: { bbox },
    filters: {
      ...(groups.length && { category_group_ids: groups }),
      ...(categories.length && { category_ids: categories }),
    }
  });
}

export async function getDirections(coordinates) {
  const api = new Directions({ api_key: OPENROUTESERVICE_KEY });

  return api.calculate({
    coordinates: coordinates,
    profile: 'cycling-regular',
    geometry_format: 'polyline',
    format: 'json'
  }).then(path => {
    console.log(JSON.stringify(path));
  });
}
