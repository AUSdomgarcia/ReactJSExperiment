import axios from 'axios';
import jquery from 'jquery';

const baseURL = 'http://www.cerebrum-api-staging.dev:8096/api'; // PROD
// const baseURL = 'http://172.16.100.102/api.cerebrum/public'; // LOCAL







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
let postServiceCreate = function(obj){
  return axios.post( baseURL + '/rate-cards/services/create', obj );
}
let postServiceUpdate = function(obj){
  return axios.post( baseURL + '/rate-cards/services/update', obj ); 
}
let postServiceDelete = function(obj){
  return axios.post( baseURL + '/rate-cards/services/delete', obj );
}
let getServiceByServiceIdWithServiceCategoryId = function(categoryId, serviceId){
  return axios.get( baseURL + '/rate-cards/services?id=' + serviceId + '&service_category_id=' + categoryId);
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







{/* Personnels */}
let getServicePersonnels = function(){
  return axios.get( baseURL + '/rate-cards/personnels');
}
let getPersonnelsDepartment = function(){
  return axios.get( baseURL + '/rate-cards/personnels/departments');
}
let getPersonnelsPositions = function(){
  return axios.get( baseURL + '/rate-cards/personnels/positions');
}
let postPersonnelsCreate = function(obj){
  return axios.post( baseURL + '/rate-cards/personnels/create', obj );
}
let postPersonnelsUpdate = function(obj){
  return axios.post( baseURL + '/rate-cards/personnels/update', obj );
}
let postPersonnelsDelete = function(obj){
  return axios.post( baseURL + '/rate-cards/personnels/delete', obj );
}







{/* Logs */}
let getLogs = function(id){
  return axios.get( baseURL + '/rate-cards/services/logs?service_id='+ id );
}







{/* Rate Cards */}
let getRateCards = function(){
  return axios.get( baseURL + '/rate-cards/rate-cards');
}
let getRateCardById = function(id){
  return axios.get( baseURL + '/rate-cards/rate-cards?id='+ id); 
}
let getRateCardServicesById = function(id){
  return axios.get( baseURL + '/rate-cards/services?rate_type_id='+ id);  
}
let getRateCardsPersonnelEmployees = function(){
  return axios.get( baseURL + '/rate-cards/personnels/employees');
}
let getRateCardsPersonnelEmployeesByDefault = function(){
  return axios.get( baseURL + '/rate-cards/personnels/employees?default');
}
let postRateCardCreate = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-cards/create', obj);
}
let postRateCardUpdate = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-cards/update', obj);
}
let postRateCardPreview = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-cards/preview', obj);
}
let postRateCardAction = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-cards/action', obj);
}







{/* Packages */}
let getRateCardPackages = function(){
  return axios.get( baseURL + '/rate-cards/packages' );
}







export { 
  getServices, 
  getServiceByCategoryId, 
  getServiceCreateDetails,
  postServiceCategoriesDelete,
  postServiceCategories_subCategories_create,
  postServiceCategories_subCategories_update,
  postServiceCategories_subCategories_delete,

  getServiceCategoriesRoot,
  postServiceCategoriesCreate,
  postServiceCategoriesUpdate,
  getServiceCategories_subCategories_level2_byParentId,
  getServiceCategories_subCategories_level3_byParentId,

  postServiceCreate,
  postServiceUpdate,
  postServiceDelete,
  getServiceByServiceIdWithServiceCategoryId,

  getServicePersonnels,
  getPersonnelsDepartment,
  getPersonnelsPositions,
  postPersonnelsCreate,
  postPersonnelsUpdate,
  postPersonnelsDelete,

  getServiceRateTypes,
  postServiceRateTypesCreate,
  postServiceRateTypesDelete,

  getLogs,

  getRateCards,
  getRateCardServicesById,
  getRateCardsPersonnelEmployees,
  getRateCardsPersonnelEmployeesByDefault,
  postRateCardCreate,
  postRateCardUpdate,
  getRateCardById,
  postRateCardPreview,
  postRateCardAction,

  getRateCardPackages
}
