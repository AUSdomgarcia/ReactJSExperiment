import axios from 'axios';
import jquery from 'jquery';

const baseURL = 'http://www.cerebrum-api-staging.dev:8096/api'; // PROD
// const baseURL = 'http://www.cerebrum-api-staging.dev:8096/api'; // LOCAL







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
let getServicePersonnels = function(){
  return axios.get( baseURL + '/rate-cards/personnels');
}







{/* Categories */}
let getServiceCategoriesRoot = function(){
  return axios.get( baseURL + '/rate-cards/service-categories');
}
let postServiceCategoriesCreate = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/create', obj );
}
let postServiceCategoriesUpdate = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/update', obj );
}
let getServiceCategories_subCategories_level2_byParentId = function(parentId){
  return axios.get( baseURL + '/rate-cards/service-categories/sub-categories/level-2?parent_id=' + parentId);
}
let getServiceCategories_subCategories_level3_byParentId = function(parentId){
  return axios.get( baseURL + '/rate-cards/service-categories/sub-categories/level-3?parent_id=' + parentId);
}
let postServiceCategoriesDelete = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/delete', obj );
}
let postServiceCategories_subCategories_create = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/sub-categories/create', obj );
}
let postServiceCategories_subCategories_update = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/sub-categories/update', obj );
}
let postServiceCategories_subCategories_delete = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/sub-categories/delete', obj );
}






{/* Rate Types */}
let getServiceRateTypes = function(){
  return axios.get( baseURL + '/rate-cards/rate-types');
}
let postServiceRateTypesCreate = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-types/create', obj );
}
let postServiceRateTypesDelete = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-types/delete', obj );
}







export { 
  getServices, 
  getServiceByCategoryId, 
  getServiceCreateDetails,
  getServicePersonnels,
  postServiceCategoriesDelete,
  postServiceCategories_subCategories_create,
  postServiceCategories_subCategories_update,
  postServiceCategories_subCategories_delete,

  getServiceCategoriesRoot,
  postServiceCategoriesCreate,
  postServiceCategoriesUpdate,
  getServiceCategories_subCategories_level2_byParentId,
  getServiceCategories_subCategories_level3_byParentId,

  getServiceRateTypes,
  postServiceRateTypesCreate,
  postServiceRateTypesDelete
}
