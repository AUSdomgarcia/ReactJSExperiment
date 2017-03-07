import axios from 'axios';
import jquery from 'jquery';

const baseURL = 'http://www.cerebrum-api-staging.dev:8096/api'; // PROD
// const baseURL = 'http://172.16.100.90/api.cerebrum/public'; // LOCAL







{/* Services */}
let getServices = function() {
  return axios.get( baseURL + '/rate-cards/service-categories/services');
}
let getServiceByCategoryId = function(id){
  return axios.get( baseURL + '/rate-cards/services?service_category_id=' + id +'&level1=1');
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
let getRateCardServicesAll = function(){
  return axios.get( baseURL + '/rate-cards/services' );
}
let getServicesById = function(id){
  return axios.get( baseURL + '/rate-cards/services?id=' + id);
}
let getRateCardServicesSearch = function(params){
  return axios.get( baseURL + '/rate-cards/services/search' + params );
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
let postRateCardRateTypesUpdate = function(obj){
  return axios.post( baseURL + '/rate-cards/rate-types/update', obj );
}








{/* Personnels */}
let getServicePersonnels = function(){
  return axios.get( baseURL + '/rate-cards/personnels');
}
let getServicePersonnelsByRateTypeId = function(id){
  return axios.get( baseURL + '/rate-cards/personnels?rate_type_id=' + id);
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
let getPersonnelSearch = function(params){

  console.log( baseURL + '/rate-cards/personnels/search' + params );
  
  return axios.get( baseURL + '/rate-cards/personnels/search' + params )
}
let getRateCardsServiceByServiceCategoryByServiceCategoryId = function(id){
  return axios.get( baseURL + '/rate-cards/services/by-service-category?service_category_id=' + id );
}
let getRateCardPersonnelPagination = function(page, limit){
  return axios.get( baseURL + '/rate-cards/personnels/search?page=' + page + '&limit=' + limit);
}






{/* Logs */}
let getLogs = function(id, page, limit){
  return axios.get( baseURL + '/rate-cards/services/logs?service_id='+ id + '&page=' + page + '&limit=' + limit );
}







{/* Rate Cards */}
let getRateCardsDefault = function(){
  return axios.get( baseURL + '/rate-cards/rate-cards');
}
let getRateCardsActive = function(){
  return axios.get( baseURL + '/rate-cards/rate-cards?active=baymax');
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
let getRateCardPackageById = function(id){
  return axios.get( baseURL + '/rate-cards/packages?id='+id);
}
let postPackageCreate = function(obj){
  return axios.post( baseURL + '/rate-cards/packages/create', obj);
}
let postPackageUpdate = function(obj){
  return axios.post( baseURL + '/rate-cards/packages/update', obj);
}
let postPackageDelete = function(obj){
  return axios.post( baseURL + '/rate-cards/packages/delete', obj);
}
let postPackagePreview = function(obj){
  return axios.post( baseURL + '/rate-cards/packages/preview', obj);
}







{/* Sortable */}
let postRatecardServiceCategoriesSortServiceCategories = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/sort-service-categories', obj);
}
let postRatecardServiceCategoriesSortServiceSubCategories = function(obj){
  return axios.post( baseURL + '/rate-cards/service-categories/sort-service-sub_categories', obj);
}



export { 
  getServices, 
  getServicesById,
  
  getServiceByCategoryId, 
  getServiceCreateDetails,
  postServiceCategoriesDelete,
  postServiceCategories_subCategories_create,
  postServiceCategories_subCategories_update,
  postServiceCategories_subCategories_delete,
  getRateCardServicesAll,

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
  getServicePersonnelsByRateTypeId,
  getPersonnelsDepartment,
  getPersonnelsPositions,
  postPersonnelsCreate,
  postPersonnelsUpdate,
  postPersonnelsDelete,

  getServiceRateTypes,
  postServiceRateTypesCreate,
  postServiceRateTypesDelete,

  getLogs,

  getRateCardsActive,
  getRateCardsDefault,
  getRateCardServicesById,
  getRateCardsPersonnelEmployees,
  getRateCardsPersonnelEmployeesByDefault,
  postRateCardCreate,
  postRateCardUpdate,
  getRateCardById,
  postRateCardPreview,
  postRateCardAction,

  getRateCardPackages,
  postPackageCreate,
  postPackageUpdate,
  postPackageDelete,
  getRateCardPackageById,
  postPackagePreview,

  postRatecardServiceCategoriesSortServiceCategories,
  postRatecardServiceCategoriesSortServiceSubCategories,

  postRateCardRateTypesUpdate,
  getPersonnelSearch,
  getRateCardsServiceByServiceCategoryByServiceCategoryId,
  getRateCardPersonnelPagination,
  getRateCardServicesSearch
  
}
