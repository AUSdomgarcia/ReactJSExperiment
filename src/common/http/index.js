import axios from 'axios';
import jquery from 'jquery';

const baseURL = 'http://www.cerebrum-api-staging.dev:8096/api';
// const baseURL = 'http://www.cerebrum-api-staging.dev:8096/api';

{/* Services */}
let getServices = function() {
  return axios.get( baseURL + '/rate-cards/service-categories/services');
}

let getServiceByCategoryId = function(categoryId){
  return axios.get( baseURL + '/rate-cards/services?service_category_id=' + categoryId);
}

let getServiceCreateDetails = function(){
  return axios.get( baseURL + '/rate-cards/services/create-details');
}

let getServiceRateTypes = function(){
  return axios.get( baseURL + '/rate-cards/rate-types');
}

{/* Categories */}
let getServiceCategories_subCategories_level2_byParentId = function(parentId){
  return axios.get('/rate-cards/service-categories/sub-categories/level-2?parent_id=' + parentId);
}
let getServiceCategories_subCategories_level3_byParentId = function(parentId){
  return axios.get('/rate-cards/service-categories/sub-categories/level-3?parent_id=' + parentId);
}

export { 
  getServices, 
  getServiceByCategoryId, 
  getServiceCreateDetails,
  getServiceRateTypes,

  getServiceCategories_subCategories_level2_byParentId,
  getServiceCategories_subCategories_level3_byParentId
}
