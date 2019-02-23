import { OPENROUTESERVICE_KEY } from 'react-native-dotenv';
import axios from 'axios';
import R from 'ramda';

const MAX_RANGE = 2000;

const ORS = axios.create({
  baseURL: 'https://api.openrouteservice.org',
  params: {
    api_key: OPENROUTESERVICE_KEY
  }
});

async function getBoundingBox({ longitude, latitude }, range) {
  return ORS.get('isochrones', {
    params: {
      locations: `${longitude},${latitude}`,
      profile: 'cycling-regular',
      range_type: 'distance',
      range,
    }
  }).then(({ data }) => R.splitEvery(2, data.bbox))
}

export async function getPois(coordinate, types = [], range = MAX_RANGE) {
  const bbox = await getBoundingBox(coordinate, Math.min(range, MAX_RANGE));

  const isGroupCategory = type => type % 10 == 0;
  const groups = types.filter(isGroupCategory);
  const categories = types.filter(R.complement(isGroupCategory));

  return ORS.post('pois', {
    request: 'pois',
    geometry: { bbox },
    filters: {
      ...(groups.length > 0 ? { category_group_ids: groups } : {}),
      ...(categories.length > 0 ? { category_ids: categories } : {}),
    },
  }).then(({ data }) => data.features);
}

export async function getDirections(coordinates) {
  return ORS.get('directions', {
    params: {
      coordinates: coordinates
        .map(({ longitude, latitude }) => `${longitude},${latitude}`)
        .join('|'),
      profile: 'cycling-regular',
      geometry_format: 'polyline',
      format: 'json'
    }
  }).then(R.prop('data'));
}

export async function getCurrentLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function ({ coords }) {
      resolve(coords);
    }, reject);
  });
}
