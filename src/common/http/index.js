import axios from 'axios';

const baseURL = 'http://cerebrum-api.dev:8098';

let getServices = function() {
  return axios.get( baseURL + '/rate-cards/service-categories/services');
}

let getServiceByCategoryId = function(categoryId){
  return axios.get( baseURL + '/rate-cards/services?service_category_id=' + categoryId);
}

export { getServices, getServiceByCategoryId }
