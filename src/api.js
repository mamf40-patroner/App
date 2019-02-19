import { OPENROUTESERVICE_KEY } from 'react-native-dotenv';
import axios from 'axios';
import R from 'ramda';

async function getBoundingBox({ longitude, latitude }, range) {
  return axios.get('https://api.openrouteservice.org/isochrones', {
    params: {
      api_key: OPENROUTESERVICE_KEY,
      locations: `${longitude},${latitude}`,
      profile: 'cycling-regular',
      range_type: 'distance',
      range,
    }
  }).then(({ data }) => R.splitEvery(2, data.bbox))
}

export async function getPois(coordinate, types = [], range = 2000) {
  const bbox = await getBoundingBox(coordinate, Math.min(range, 2000));

  const isGroupCategory = type => type % 10 == 0;
  const groups = types.filter(isGroupCategory);
  const categories = types.filter(R.complement(isGroupCategory));

  const filters = {}
  if (groups.length > 0) {
    filters.category_group_ids = groups;
  }

  if (categories.length > 0) {
    filters.category_ids = categories;
  }

  return axios.post(`https://api.openrouteservice.org/pois?api_key=${OPENROUTESERVICE_KEY}`, {
    request: 'pois',
    geometry: { bbox },
    filters,
  }).then(({ data }) => data.features);
}

export async function getDirections(coordinates) {
  const api = new Directions({ api_key: OPENROUTESERVICE_KEY });

  return api.calculate({
    coordinates,
    profile: 'cycling-regular',
    geometry_format: 'polyline',
    format: 'json'
  }).then(path => {
    console.log(JSON.stringify(path));
  });
}

export async function getCurrentLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function({ coords }) {
      resolve(coords);
    }, reject);
  });
}
